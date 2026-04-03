package com.ramap

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

// 라맵 애플리케이션 진입점
@SpringBootApplication
class RamapApplication

fun main(args: Array<String>) {
    runApplication<RamapApplication>(*args)
}
