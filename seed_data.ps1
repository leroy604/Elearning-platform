# Seed Script for Elearning Platform (Resilient Version)
$baseUrl = "http://localhost:8080/api"

function Write-Host-Color($message, $color) {
    Write-Host $message -ForegroundColor $color
}

Write-Host-Color "Waiting 20 seconds for services to fully initialize..." "Yellow"
Start-Sleep -Seconds 20

function Invoke-WithRetry {
    param($Uri, $Method, $Body)
    $maxRetries = 5
    $retryCount = 0
    while ($retryCount -lt $maxRetries) {
        try {
            return Invoke-RestMethod -Uri $Uri -Method $Method -Body $Body -ContentType "application/json"
        } catch {
            $retryCount++
            Write-Host "Attempt $retryCount failed. Retrying in 5 seconds..." -ForegroundColor Gray
            Start-Sleep -Seconds 5
        }
    }
    throw "Request failed after $maxRetries attempts."
}

Write-Host-Color "--- Seeding Courses ---" "Cyan"

$courses = @(
    @{
        title = "React Fundamentals"
        description = "Build modern UIs with components, hooks, and routing."
        instructor = "Amina K."
        price = 29.99
        category = "Web Development"
        level = "BEGINNER"
        duration = 10
        language = "English"
        instructorId = 1
    },
    @{
        title = "Java + Spring Boot Microservices"
        description = "Design resilient services with discovery, gateway routing, and auth."
        instructor = "David N."
        price = 49.99
        category = "Backend Development"
        level = "INTERMEDIATE"
        duration = 25
        language = "English"
        instructorId = 2
    }
)

$courseIds = @()

foreach ($course in $courses) {
    Write-Host "Creating course: $($course.title)..."
    $response = Invoke-WithRetry -Uri "$baseUrl/courses" -Method Post -Body ($course | ConvertTo-Json)
    if ($response -and $response.id) {
        $courseIds += $response.id
        Write-Host-Color "Created course with ID: $($response.id)" "Green"
    }
}

Write-Host-Color "`n--- Seeding Exams ---" "Cyan"

foreach ($id in $courseIds) {
    $exam = @{
        title = "Final Exam for Course $id"
        description = "Comprehensive test of all covered modules."
        duration = 60
        totalQuestions = 20
        passingScore = 14
        courseId = $id
    }
    Write-Host "Creating exam for course $id..."
    $response = Invoke-WithRetry -Uri "$baseUrl/exams" -Method Post -Body ($exam | ConvertTo-Json)
    if ($response -and $response.id) {
      Write-Host-Color "Created exam with ID: $($response.id)" "Green"
    }
}

Write-Host-Color "`n--- Seeding Completed successfully ---" "Green"
