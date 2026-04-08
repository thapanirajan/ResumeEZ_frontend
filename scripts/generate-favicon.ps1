param(
  [string] $OutputIcoPath = (Join-Path $PSScriptRoot "..\\app\\favicon.ico"),
  [string] $OutputPngPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

function New-LogoBitmap {
  param(
    [int] $Size
  )

  $bitmap = New-Object System.Drawing.Bitmap $Size, $Size
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

  $bg = [System.Drawing.ColorTranslator]::FromHtml("#1E3A8A")
  $white = [System.Drawing.Color]::White

  $graphics.Clear([System.Drawing.Color]::Transparent)

  $rect = New-Object System.Drawing.RectangleF 0, 0, $Size, $Size
  $radius = [Math]::Max([Math]::Round($Size * 0.18), 2)
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath

  $diameter = $radius * 2
  $path.AddArc($rect.X, $rect.Y, $diameter, $diameter, 180, 90) | Out-Null
  $path.AddArc($rect.Right - $diameter, $rect.Y, $diameter, $diameter, 270, 90) | Out-Null
  $path.AddArc($rect.Right - $diameter, $rect.Bottom - $diameter, $diameter, $diameter, 0, 90) | Out-Null
  $path.AddArc($rect.X, $rect.Bottom - $diameter, $diameter, $diameter, 90, 90) | Out-Null
  $path.CloseFigure()

  $brush = New-Object System.Drawing.SolidBrush $bg
  $graphics.FillPath($brush, $path)

  $fontSize = [Math]::Round($Size * 0.62)
  $font = New-Object System.Drawing.Font "Segoe UI", $fontSize, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)

  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center

  $textRect = New-Object System.Drawing.RectangleF 0, ($Size * 0.03), $Size, $Size
  $textBrush = New-Object System.Drawing.SolidBrush $white
  $graphics.DrawString("R", $font, $textBrush, $textRect, $format)

  $graphics.Dispose()
  $brush.Dispose()
  $textBrush.Dispose()
  $font.Dispose()
  $path.Dispose()
  $format.Dispose()

  return $bitmap
}

function Convert-PngToIco {
  param(
    [byte[]] $PngBytes,
    [System.IO.BinaryWriter] $Writer,
    [int] $Size
  )

  $widthByte = if ($Size -ge 256) { 0 } else { $Size }
  $heightByte = if ($Size -ge 256) { 0 } else { $Size }

  # ICONDIRENTRY (16 bytes)
  $Writer.Write([byte] $widthByte)   # bWidth
  $Writer.Write([byte] $heightByte)  # bHeight
  $Writer.Write([byte] 0)            # bColorCount
  $Writer.Write([byte] 0)            # bReserved
  $Writer.Write([UInt16] 1)          # wPlanes
  $Writer.Write([UInt16] 32)         # wBitCount
  $Writer.Write([UInt32] $PngBytes.Length) # dwBytesInRes
  $Writer.Write([UInt32] 0)          # dwImageOffset (filled later)
}

function Write-Ico {
  param(
    [hashtable] $ImagesBySize,
    [string] $Path
  )

  $sizes = $ImagesBySize.Keys | Sort-Object

  $stream = [System.IO.File]::Open($Path, [System.IO.FileMode]::Create, [System.IO.FileAccess]::Write, [System.IO.FileShare]::None)
  $writer = New-Object System.IO.BinaryWriter $stream

  try {
    # ICONDIR (6 bytes)
    $writer.Write([UInt16] 0)              # idReserved
    $writer.Write([UInt16] 1)              # idType (1 = icon)
    $writer.Write([UInt16] $sizes.Count)   # idCount

    $entryStart = $stream.Position

    foreach ($size in $sizes) {
      Convert-PngToIco -PngBytes $ImagesBySize[$size] -Writer $writer -Size $size
    }

    $imageDataStart = $stream.Position
    $currentOffset = $imageDataStart

    # Patch offsets and write image data
    for ($index = 0; $index -lt $sizes.Count; $index++) {
      $size = $sizes[$index]
      $pngBytes = $ImagesBySize[$size]

      $entryOffset = $entryStart + ($index * 16) + 12 # offset field within entry
      $stream.Position = $entryOffset
      $writer.Write([UInt32] $currentOffset)

      $stream.Position = $currentOffset
      $writer.Write($pngBytes)

      $currentOffset = $stream.Position
    }
  }
  finally {
    $writer.Dispose()
    $stream.Dispose()
  }
}

$sizes = @(16, 32, 48, 64, 128, 256)
$images = @{}

foreach ($size in $sizes) {
  $bmp = New-LogoBitmap -Size $size
  try {
    $ms = New-Object System.IO.MemoryStream
    $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $images[$size] = $ms.ToArray()
    $ms.Dispose()
  }
  finally {
    $bmp.Dispose()
  }
}

Write-Ico -ImagesBySize $images -Path $OutputIcoPath

if ($OutputPngPath) {
  if (-not (Test-Path (Split-Path -Parent $OutputPngPath))) {
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $OutputPngPath) | Out-Null
  }

  $preview = New-LogoBitmap -Size 512
  try {
    $preview.Save($OutputPngPath, [System.Drawing.Imaging.ImageFormat]::Png)
  }
  finally {
    $preview.Dispose()
  }
}

Write-Host "Wrote favicon: $OutputIcoPath"
if ($OutputPngPath) {
  Write-Host "Wrote preview: $OutputPngPath"
}
