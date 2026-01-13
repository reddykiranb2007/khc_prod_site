$files = Get-ChildItem *.html -Exclude "clients-gallery.html"
$desktopLink = '<a href="clients-gallery.html" class="text-gray-600 hover:text-[#008ED6] transition-colors font-medium">Clients & Gallery</a>'
$mobileLink = '<a href="clients-gallery.html" class="hover:text-[#008ED6] font-medium">Clients & Gallery</a>'

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # Check if link already exists
    if ($content -notmatch 'href="clients-gallery.html"') {
        
        # Regex to find "About Us" link (handles attributes order and active state)
        # We capture the whole tag in $1
        $pattern = '(?i)(<a\s+[^>]*href="about\.html"[^>]*>About\s+Us</a>)'
        
        # Replace function to choose Desktop/Mobile style based on context
        $content = [regex]::Replace($content, $pattern, {
            param($match)
            $tag = $match.Value
            
            # If tag contains "text-gray" or active color "text-[#0B3C68]", treat as Desktop
            if ($tag -match 'text-gray-600' -or $tag -match 'text-\[#0B3C68\]') {
                return "$desktopLink`r`n        $tag"
            } 
            # Otherwise treat as Mobile (or generic)
            else {
                return "$mobileLink`r`n                $tag"
            }
        })
        
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        Write-Host "Updated $($file.Name)"
    } else {
        Write-Host "Skipped $($file.Name) (Already has link)"
    }
}
