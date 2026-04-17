import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

/**
 * Generates a professional PDF report for the user directory.
 * @param {Array} users List of all users in the system.
 */
export const generateUserReport = (users) => {
  try {
    if (!users || !Array.isArray(users)) {
      throw new Error("Invalid user data provided for report generation.");
    }

    const doc = new jsPDF();
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const fileDate = format(new Date(), 'yyyy-MM-dd');

    // ─── Header Section ────────────────────────────────────────────────────────
    
    // App Branding
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont('helvetica', 'bold');
    doc.text('Smart Campus Operations Hub', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.setFont('helvetica', 'normal');
    doc.text('SYSTEM REGISTRY | USER DIRECTORY REPORT', 14, 28);

    // Metadata
    doc.setFontSize(9);
    doc.text(`Generated on: ${timestamp}`, 14, 38);
    doc.text(`Total Records: ${users.length}`, 14, 43);

    // Horizontal Line
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.line(14, 48, 196, 48);

    // ─── Table Section ─────────────────────────────────────────────────────────

    const tableColumn = [
      "Full Name", 
      "Department", 
      "Role", 
      "Status", 
      "Phone Number", 
      "Email Address"
    ];
    
    const tableRows = users.map(user => {
      if (!user) return ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
      return [
        user.fullName || 'N/A',
        user.department || 'UNCATEGORIZED',
        (user.role || 'USER').replace('ROLE_', '').replace('ADMIN', 'Admin').replace('TECHNICIAN', 'Technician').replace('USER', 'User'),
        user.isActive ? 'ACTIVE' : 'DEACTIVATED',
        user.phoneNumber || 'NOT PROVIDED',
        user.email || 'N/A'
      ];
    });

    autoTable(doc, {
      startY: 55,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [79, 70, 229], // indigo-600
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'left',
      cellPadding: 4
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [51, 65, 85], // slate-700
      cellPadding: 3
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252] // slate-50
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
      2: { fontStyle: 'bold' },
      3: { fontStyle: 'bold' }
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      // Footer
      const str = 'Page ' + doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // slate-400
      const pageSize = doc.internal.pageSize;
      const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
      doc.text(str, data.settings.margin.left, pageHeight - 10);
      doc.text('CONfIDENTIAL SYSTEM REPORT - FOR ADMINISTRATIVE USE ONLY', 140, pageHeight - 10, { align: 'right' });
    }
  });

    // ─── Save the PDF ──────────────────────────────────────────────────────────
    doc.save(`Smart-Campus-Users-Report-${fileDate}.pdf`);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw error;
  }
};
