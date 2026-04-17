$baseUrl = "http://localhost:8080/api"

function Write-Host-Color($message, $color) {
    Write-Host $message -ForegroundColor $color
}

function Invoke-WithRetry {
    param($Uri, $Method, $Body)
    $maxRetries = 5
    $retryCount = 0
    while ($retryCount -lt $maxRetries) {
        try {
            if ($Method -eq "Get") {
                return Invoke-RestMethod -Uri $Uri -Method $Method -ContentType "application/json"
            } else {
                return Invoke-RestMethod -Uri $Uri -Method $Method -Body $Body -ContentType "application/json"
            }
        } catch {
            $retryCount++
            Write-Host "Attempt $retryCount failed for $Uri. Retrying in 2 seconds..." -ForegroundColor Gray
            Start-Sleep -Seconds 2
        }
    }
    throw "Request failed after $maxRetries attempts for $Uri"
}

Write-Host-Color "--- Populating Exams and Questions ---" "Cyan"

# Fetch all courses
Write-Host "Fetching courses..."
$courses = Invoke-WithRetry -Uri "$baseUrl/courses" -Method Get

if (-not $courses -or $courses.Count -eq 0) {
    Write-Host-Color "No courses found. Please run seed_data.ps1 first." "Red"
    exit
}

$sampleQuestions = @(
    @{
        content = "What is the primary purpose of this technology?"
        options = @("Data Storage", "User Interface Development", "Network Routing", "Machine Learning")
        correctAnswerIndex = 1
    },
    @{
        content = "Which of the following is considered a best practice?"
        options = @("Hardcoding credentials", "Using version control", "Ignoring errors", "Deploying without testing")
        correctAnswerIndex = 1
    },
    @{
        content = "How do you define a variable that cannot be reassigned?"
        options = @("var", "let", "const", "static")
        correctAnswerIndex = 2
    },
    @{
        content = "What is the output of 2 + '2' in JavaScript?"
        options = @("4", "'22'", "NaN", "Error")
        correctAnswerIndex = 1
    },
    @{
        content = "Which HTTP method is typically used to create a new resource?"
        options = @("GET", "POST", "PUT", "DELETE")
        correctAnswerIndex = 1
    }
)

foreach ($course in $courses) {
    $courseId = $course.id
    Write-Host-Color "Processing Course: $($course.title) (ID: $courseId)" "Yellow"

    $exams = Invoke-WithRetry -Uri "$baseUrl/exams/course/$courseId" -Method Get
    
    $examId = $null
    
    if (-not $exams -or $exams.Count -eq 0) {
        Write-Host "No exam found. Creating exam for course $courseId..."
        $exam = @{
            title = "Final Certification Exam"
            description = "Comprehensive final test for $($course.title)."
            duration = 60
            totalQuestions = 5
            passingScore = 80
            courseId = $courseId
        }
        $newExam = Invoke-WithRetry -Uri "$baseUrl/exams" -Method Post -Body ($exam | ConvertTo-Json)
        $examId = $newExam.id
        Write-Host-Color "Created new exam with ID: $examId" "Green"
    } else {
        $examId = $exams[0].id
        Write-Host "Found existing exam with ID: $examId"
    }
    
    # Check questions for the exam
    $questions = Invoke-WithRetry -Uri "$baseUrl/exams/$examId/questions" -Method Get
    if (-not $questions -or $questions.Count -lt 5) {
        Write-Host "Seeding questions for Exam ID: $examId..."
        foreach ($q in $sampleQuestions) {
            $body = $q | ConvertTo-Json -Compress
            Invoke-WithRetry -Uri "$baseUrl/exams/$examId/questions" -Method Post -Body $body > $null
        }
        Write-Host-Color "Successfully seeded 5 questions for Exam ID: $examId" "Green"
    } else {
        Write-Host "Exam $examId already has questions. Skipping."
    }
}

Write-Host-Color "`n--- Exmas and Questions Seeded Successfully ---" "Green"
