import type jsPDFType from 'jspdf'
import { formatCurrency, formatDate, quoteStatusLabel } from '../api/format'
import { getStoredWorkspace } from '../api/session'
import type { Quote, WorkspaceSettings } from '../api/types'

export async function downloadQuotePdf(quote: Quote, settings?: WorkspaceSettings | null) {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ])
  const workspace = getStoredWorkspace()
  const companyName = settings?.companyName ?? workspace?.name ?? 'Blume'
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 16

  doc.setFillColor(0, 122, 85)
  doc.rect(0, 0, pageWidth, 34, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text(companyName, margin, 17)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Propuesta / Presupuesto', margin, 25)

  doc.setTextColor(15, 23, 42)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text(`Presupuesto ${quote.code}`, margin, 50)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Estado: ${quoteStatusLabel(quote.status)}`, margin, 58)
  doc.text(`Fecha: ${formatDate(quote.date)}`, margin, 65)
  doc.text(`Validez: ${formatDate(quote.validUntil)}`, margin, 72)

  const issuerLines = [
    settings?.taxId ? `NIF/CIF: ${settings.taxId}` : null,
    [settings?.address, settings?.postalCode, settings?.city].filter(Boolean).join(', '),
    settings?.country,
  ].filter(Boolean) as string[]

  if (issuerLines.length > 0) {
    doc.setFont('helvetica', 'bold')
    doc.text('Emisor', margin, 82)
    doc.setFont('helvetica', 'normal')
    doc.text(issuerLines, margin, 88, { maxWidth: pageWidth / 2 - margin - 4 })
  }

  doc.setFont('helvetica', 'bold')
  doc.text('Cliente', pageWidth / 2 + 4, 50)
  doc.setFont('helvetica', 'normal')
  const clientLines = [
    quote.client.name,
    quote.client.contact,
    quote.client.email,
    quote.client.phone,
    quote.client.taxId ? `NIF/CIF: ${quote.client.taxId}` : null,
    [quote.client.address, quote.client.postalCode, quote.client.city].filter(Boolean).join(', '),
  ].filter(Boolean) as string[]
  doc.text(clientLines, pageWidth / 2 + 4, 58, { maxWidth: pageWidth / 2 - margin - 4 })

  autoTable(doc, {
    startY: 108,
    head: [['Servicio', 'Cantidad', 'Precio', 'Total']],
    body: quote.items.map((item) => [
      [item.name, item.description].filter(Boolean).join('\n'),
      String(item.quantity),
      formatCurrency(item.unitPrice),
      formatCurrency(item.total),
    ]),
    margin: { left: margin, right: margin },
    styles: {
      font: 'helvetica',
      fontSize: 9,
      cellPadding: 3,
      valign: 'middle',
    },
    headStyles: {
      fillColor: [0, 122, 85],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      1: { halign: 'right', cellWidth: 24 },
      2: { halign: 'right', cellWidth: 34 },
      3: { halign: 'right', cellWidth: 34 },
    },
  })

  const finalY = (doc as jsPDFType & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 120
  const totalsX = pageWidth - margin - 70
  const valuesX = pageWidth - margin
  const totalsY = finalY + 12

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Subtotal', totalsX, totalsY)
  doc.text(formatCurrency(quote.subtotal), valuesX, totalsY, { align: 'right' })
  doc.text(`IVA ${Number(quote.taxRate)}%`, totalsX, totalsY + 8)
  doc.text(formatCurrency(quote.taxAmount), valuesX, totalsY + 8, { align: 'right' })
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Total', totalsX, totalsY + 18)
  doc.text(formatCurrency(quote.total), valuesX, totalsY + 18, { align: 'right' })

  if (quote.notes) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text('Notas', margin, totalsY + 34)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(quote.notes, margin, totalsY + 42, { maxWidth: pageWidth - margin * 2 })
  }

  doc.setFontSize(8)
  doc.setTextColor(100, 116, 139)
  doc.text('Documento generado desde Blume. Esta propuesta no sustituye una factura.', margin, 285)

  doc.save(`${quote.code}.pdf`)
}
