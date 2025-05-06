let fullScript = "";

async function generateScript() {
  const genre = document.getElementById('genre').value;
  const idea = document.getElementById('idea').value;
  const outputDiv = document.getElementById('output');
  const continueBtn = document.getElementById('continueButton');

  outputDiv.textContent = 'Generating...';
  continueBtn.style.display = 'none';

  const response = await fetch('http://localhost:3000/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ genre, idea })
  });

  const data = await response.json();
  fullScript = data.idea || 'Something went wrong.';
  outputDiv.textContent = fullScript;
  continueBtn.style.display = 'inline-block';
}

async function continueScript() {
  const outputDiv = document.getElementById('output');

  outputDiv.textContent += '\n\nGenerating next 5 pages...';

  const response = await fetch('http://localhost:3000/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ continuation: fullScript })
  });

  const data = await response.json();
  fullScript += '\n\n' + (data.idea || 'Something went wrong.');
  outputDiv.textContent = fullScript;
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter'
  });

  doc.setFont('Courier', 'normal');
  doc.setFontSize(12);

  const margin = 40;
  const pageHeight = doc.internal.pageSize.height;
  const lines = doc.splitTextToSize(fullScript, 520);
  let y = margin;

  lines.forEach(line => {
    if (y + 15 > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += 15;
  });

  doc.save("screenplay.pdf");
}
