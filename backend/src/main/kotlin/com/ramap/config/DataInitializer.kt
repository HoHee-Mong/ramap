package com.ramap.config

import com.ramap.model.Category
import com.ramap.repository.CategoryRepository
import org.bson.Document
import org.springframework.boot.CommandLineRunner
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Criteria
import org.springframework.data.mongodb.core.query.Query
import org.springframework.data.mongodb.core.query.Update
import org.springframework.stereotype.Component

// 앱 시작 시 초기 카테고리 삽입 및 기존 Shop 데이터 마이그레이션 실행
@Component
class DataInitializer(
    private val categoryRepository: CategoryRepository,
    private val mongoTemplate: MongoTemplate
) : CommandLineRunner {

    override fun run(vararg args: String?) {
        insertInitialCategories()
        migrateShopsRamenTypesToCategoryIds()
    }

    // 초기 카테고리 5종 삽입 (이미 존재하면 건너뜀)
    private fun insertInitialCategories(): Map<String, String> {
        val initialNames = listOf("돈코츠", "쇼유", "시오", "미소", "츠케멘")
        val categoryMap = mutableMapOf<String, String>() // 이름 → ID
        initialNames.forEach { name ->
            val existing = categoryRepository.findByName(name)
            val category = existing ?: categoryRepository.save(Category(name = name))
            categoryMap[name] = category.id!!
        }
        return categoryMap
    }

    // ramenTypes(String 배열) → categoryIds(ObjectId 배열)로 기존 Shop 도큐먼트 마이그레이션
    private fun migrateShopsRamenTypesToCategoryIds() {
        val categoryMap = categoryRepository.findAll().associate { it.name to it.id!! }

        // ramenTypes 필드가 존재하는 Shop 도큐먼트만 조회
        val query = Query(Criteria.where("ramenTypes").exists(true))
        val shops = mongoTemplate.find(query, Document::class.java, "shops")

        shops.forEach { doc ->
            val oid = doc["_id"] ?: return@forEach
            val ramenTypes = doc.getList("ramenTypes", String::class.java) ?: emptyList()
            val categoryIds = ramenTypes.mapNotNull { categoryMap[it] }

            // categoryIds 설정 후 ramenTypes 필드 제거
            val update = Update()
                .set("categoryIds", categoryIds)
                .unset("ramenTypes")
            mongoTemplate.updateFirst(
                Query(Criteria.where("_id").`is`(oid)),
                update,
                "shops"
            )
        }
    }
}
