$baseUrl = "http://localhost:8080/api"
$tempFile = "dummy_lesson_material.txt"
"This is a simulated lesson file containing core concepts for the course." | Out-File -FilePath $tempFile -Encoding utf8

function Write-Host-Color($message, $color) {
    Write-Host $message -ForegroundColor $color
}

function Invoke-WithRetry {
    param($Uri, $Method, $Body, $ContentType="application/json")
    $maxRetries = 5
    $retryCount = 0
    while ($retryCount -lt $maxRetries) {
        try {
            if ($Method -eq "Get") {
                return Invoke-RestMethod -Uri $Uri -Method $Method -ContentType $ContentType
            } else {
                return Invoke-RestMethod -Uri $Uri -Method $Method -Body $Body -ContentType $ContentType
            }
        } catch {
            $retryCount++
            Write-Host "Attempt $retryCount failed for $Uri. Retrying in 2 seconds..." -ForegroundColor Gray
            Start-Sleep -Seconds 2
        }
    }
    throw "Request failed after $maxRetries attempts for $Uri"
}

Write-Host-Color "--- Complete Course Content Seeding ---" "Cyan"

# Fetch all courses
Write-Host "Fetching registered courses..."
$courses = Invoke-WithRetry -Uri "$baseUrl/courses" -Method Get

if (-not $courses -or $courses.Count -eq 0) {
    Write-Host-Color "No courses found globally. Please run seed_data.ps1 first." "Red"
    Remove-Item $tempFile
    exit
}

$sampleQuestions = @(
    @{
        content = "What is the primary function of this module?"
        options = @("Storing state", "Defining layout", "Handling network requests", "Managing security")
        correctAnswerIndex = 1
    },
    @{
        content = "Which of the following describes the best architecture pattern?"
        options = @("Monolithic structure", "Microservices", "Hardcoded variables", "Global variables")
        correctAnswerIndex = 1
    },
    @{
        content = "What does this specific component optimize for?"
        options = @("Disk Space", "Memory", "Speed", "Database queries")
        correctAnswerIndex = 2
    },
    @{
        content = "What should you do before pushing changes?"
        options = @("Delete previous files", "Run comprehensive tests", "Restart the server", "Nothing")
        correctAnswerIndex = 1
    },
    @{
        content = "To correctly handle an API failure, you should:"
        options = @("Ignore it", "Crash the application", "Catch the error and handle gracefully", "Return a 200 OK")
        correctAnswerIndex = 2
    }
)

foreach ($course in $courses) {
    $courseId = $course.id
    Write-Host-Color "`n[+] Processing Course: $($course.title) (ID: $courseId)" "Yellow"

    # 1. Lesson Seeding
    $lessons = Invoke-WithRetry -Uri "$baseUrl/courses/$courseId/lessons" -Method Get
    if (-not $lessons -or $lessons.Count -lt 3) {
        Write-Host "Seeding 3 lessons for course $courseId..."
        for ($i = 1; $i -le 3; $i++) {
            # Construct Multipart body using curl since PowerShell Invoke-RestMethod multipart is notoriously buggy
            $title = "Chapter $i: Core Methodology"
            $cmd = "curl -s -X POST $baseUrl/courses/$courseId/lessons -F `"title=$title`" -F `"file=@$tempFile`""
            Invoke-Expression $cmd > $null
            Write-Host "  -> Uploaded Lesson $i"
        }
    } else {
        Write-Host "  -> Lessons already exist ($($lessons.Count) found)."
    }

    # 2. Exam Seeding
    $exams = Invoke-WithRetry -Uri "$baseUrl/exams/course/$courseId" -Method Get
    $examId = $null
    
    if (-not $exams -or $exams.Count -eq 0) {
        Write-Host "  -> No exam found. Generating final exam..."
        $exam = @{
            title = "Final Certification Exam"
            description = "Comprehensive final test spanning all lessons of $($course.title)."
            duration = 60
            totalQuestions = 5
            passingScore = 80
            courseId = $courseId
        }
        $newExam = Invoke-WithRetry -Uri "$baseUrl/exams" -Method Post -Body ($exam | ConvertTo-Json)
        $examId = $newExam.id
        Write-Host "  -> Created new exam with ID: $examId"
    } else {
        $examId = $exams[0].id
        Write-Host "  -> Found existing exam with ID: $examId"
    }
    
    # 3. Question Seeding
    $questions = Invoke-WithRetry -Uri "$baseUrl/exams/$examId/questions" -Method Get
    if (-not $questions -or $questions.Count -lt 5) {
        Write-Host "  -> Seeding rigorous questions for Exam ID: $examId..."
        foreach ($q in $sampleQuestions) {
            $body = $q | ConvertTo-Json -Compress
            Invoke-WithRetry -Uri "$baseUrl/exams/$examId/questions" -Method Post -Body $body > $null
        }
        Write-Host-Color "  => Successfully planted 5 questions." "Green"
    } else {
        Write-Host "  => Exam $examId already contains questions. Skipping."
    }
}

Remove-Item $tempFile
Write-Host-Color "`n--- Content Sweep & Seeding Completed ---" "Green"
