"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, FileText, FileSpreadsheet } from "lucide-react"

interface ExportButtonProps {
  data: any[]
  filename: string
  headers: string[]
  className?: string
}

export function ExportButton({ data, filename, headers, className }: ExportButtonProps) {
  const exportToCSV = () => {
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header, index) => {
            const value = Object.values(row)[index]
            // Handle values that might contain commas or quotes
            if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`
            }
            return value
          })
          .join(","),
      ),
    ].join("\n")

    downloadFile(csvContent, `${filename}.csv`, "text/csv")
  }

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(data, null, 2)
    downloadFile(jsonContent, `${filename}.json`, "application/json")
  }

  const exportToTXT = () => {
    const txtContent = [headers.join("\t"), ...data.map((row) => Object.values(row).join("\t"))].join("\n")

    downloadFile(txtContent, `${filename}.txt`, "text/plain")
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={className}>
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV} className="gap-2">
          <FileSpreadsheet className="w-4 h-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON} className="gap-2">
          <FileText className="w-4 h-4" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToTXT} className="gap-2">
          <FileText className="w-4 h-4" />
          Export as TXT
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Utility function to generate PDF (would require additional library in real implementation)
export const generatePDF = (data: any[], headers: string[], title: string) => {
  // This is a placeholder for PDF generation
  // In a real implementation, you would use a library like jsPDF or react-pdf
  console.log("PDF generation would be implemented here with a library like jsPDF")

  // For now, we'll create a simple HTML table and open it in a new window for printing
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        h1 { color: #f97316; }
        @media print {
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <table>
        <thead>
          <tr>
            ${headers.map((header) => `<th>${header}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (row) => `
            <tr>
              ${Object.values(row)
                .map((value) => `<td>${value}</td>`)
                .join("")}
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    </body>
    </html>
  `

  const newWindow = window.open("", "_blank")
  if (newWindow) {
    newWindow.document.write(htmlContent)
    newWindow.document.close()
    newWindow.print()
  }
}
