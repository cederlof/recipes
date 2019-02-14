Function New-EvernoteNoteFromTranscript {
    <#
        .SYNOPSIS
        Create an Evernote Note in a Notebook from your Powershell Transcript
        .PARAMETER Notebook
        The Evernote Notebook to add too
        .PARAMETER Title
        The title of the Note
        .PARAMETER Tag
        The Tag which to tag the Note with
        .PARAMETER Transcript
        The Transcript File with which to use
        .EXAMPLE
        $args = @{
        'NoteBook' = "Powershell Transcripts"
        "Title" = "Testing from my Function"
        "Tag" = "Powershell"
        #Get the last log stored
        "Transcript" = "$((Get-ChildItem C:\Temp\PSLogs | Sort-Object LastWriteTime | Select-Object -Last 1).FullName)"
        }
        New-EvernoteNoteFromTranscript @args
    #>
    [cmdletBinding()]
    Param(
        [Parameter(Mandatory, Position = 0, ParameterSetName = 'EvernoteArgs')]
        [string]$Notebook,
        [Parameter(Mandatory, Position = 1, ParameterSetName = 'EvernoteArgs')]
        [string]$Title,
        [Parameter(Mandatory, Position = 2, ParameterSetName = 'EvernoteArgs')]
        [string]$Tag,
        [Parameter(Mandatory, Position = 3, ParameterSetName = 'EvernoteArgs')]
        [string]$transcript
    )

    $enScript = "C:\Program Files (x86)\Evernote\Evernote\ENScript.exe"
    Start-Process $enScript  "createnote /s ""$Transcript"" /n ""$Notebook"" /i ""$Title"" $Tag" -WindowStyle Hidden

}

function ImportFileToEvernote([string]$filename) {
    $content = [IO.File]::ReadAllText($filename)
    Write-Output "$($filename) körs!"

    $titleRegex = "Title: (.*)$"
    $title = $content.split("`r`n") | Select-String -Pattern $titleRegex -AllMatches | % { $_.Matches.Groups[1] } | % { $_.Value }
    $content = $content.split("`n") | select-string -Pattern $titleRegex -NotMatch
    $content = [system.String]::Join("`n", $content)

    $categoryRegex = "Category: (.*)$"
    $category = $content.split("`r`n") | Select-String -Pattern $categoryRegex -AllMatches | % { $_.Matches.Groups[1] } | % { $_.Value }
    $content = $content.split("`n") | select-string -Pattern $categoryRegex -NotMatch
    $content = [system.String]::Join("`n", $content)

    $lineRegex = "\-\-\-"
    $content = $content.split("`n") | select-string -Pattern $lineRegex -NotMatch
    $content = [system.String]::Join("`n", $content)

    $tagsregex = "Description: (.*)$"
    $description = $content.split("`r`n") | Select-String -Pattern $tagsregex -AllMatches | % { $_.Matches.Groups[1] } | % { $_.Value }
    $content = $content.split("`n") | select-string -Pattern $tagsregex -NotMatch
    $content = [system.String]::Join("`n", $content)
    $descriptionSplit = $description.split(", ", [System.StringSplitOptions]::RemoveEmptyEntries)
    $tags = [system.String]::Join(" /t ", $descriptionSplit)

    $content = $content.replace('* ','').replace('#### ', '').replace('####', '').replace('<', '').replace('>', '').replace('**', '')

    Write-Output "tags: $($tags) length: $($descriptionSplit.length)"

    Write-Output "Title:: $($title)"
    Write-Output "Category:: $($category)"
    Write-Output "Description:: $($description)"

    Write-Output "***************"
    Write-Output $content


    [System.IO.File]::WriteAllText("$($filename).txt", $content, [System.Text.Encoding]::GetEncoding('iso-8859-1'))
    $args = @{

        'NoteBook'   = $category
        "Title"      = $title
        "Tag"        = "/t $($tags)"
        "Transcript" = "$($filename).txt"
    }

    New-EvernoteNoteFromTranscript @args
}
#ImportFileToEvernote "recept\\vit-chokladmousse.md"
Set-Location recept
Get-ChildItem -File | Where {$_.extension -like ".md"} | Foreach { ImportFileToEvernote $_.fullname}
