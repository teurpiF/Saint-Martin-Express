
function drawIcon(ctx, type) {
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 16;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // GRANDSON : véritable silhouette du Manneken-Pis
  if (type === 'manneken') {
    // Tête
    ctx.beginPath();
    ctx.arc(190, 55, 29, 0, Math.PI * 2);
    ctx.fill();

    // Corps
    ctx.beginPath();
    ctx.moveTo(165, 95);
    ctx.lineTo(215, 95);
    ctx.lineTo(225, 175);
    ctx.lineTo(155, 175);
    ctx.closePath();
    ctx.fill();

    // Jambes écartées
    ctx.beginPath();
    ctx.moveTo(160, 165);
    ctx.lineTo(190, 165);
    ctx.lineTo(175, 265);
    ctx.lineTo(145, 265);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(195, 165);
    ctx.lineTo(225, 165);
    ctx.lineTo(250, 265);
    ctx.lineTo(220, 265);
    ctx.closePath();
    ctx.fill();

    // Bras gauche le long du corps
    ctx.beginPath();
    ctx.moveTo(165, 110);
    ctx.lineTo(135, 175);
    ctx.lineTo(145, 205);
    ctx.stroke();

    // Bras droit tendu vers l'avant
    ctx.beginPath();
    ctx.moveTo(215, 110);
    ctx.lineTo(265, 155);
    ctx.lineTo(295, 155);
    ctx.stroke();

    // Jet d'eau
    ctx.beginPath();
    ctx.setLineDash([5, 13]);
    ctx.lineWidth = 10;
    ctx.moveTo(300, 155);
    ctx.quadraticCurveTo(350, 165, 405, 225);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // LE BÉMONT : verre à vin avec pied bien visible
  if (type === 'wine') {
    // Calice
    ctx.beginPath();
    ctx.moveTo(145, 55);
    ctx.lineTo(385, 55);
    ctx.lineTo(360, 150);
    ctx.quadraticCurveTo(350, 215, 265, 215);
    ctx.quadraticCurveTo(180, 215, 170, 150);
    ctx.closePath();
    ctx.fill();

    // Tige
    ctx.fillRect(252, 210, 26, 65);

    // Pied
    ctx.beginPath();
    ctx.ellipse(265, 280, 95, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // PORRENTRUY : cheval de profil
  if (type === 'horse') {
    // Corps et encolure
    ctx.beginPath();
    ctx.moveTo(105, 145);
    ctx.quadraticCurveTo(110, 105, 185, 105);
    ctx.lineTo(285, 115);
    ctx.quadraticCurveTo(315, 95, 330, 55);
    ctx.lineTo(370, 65);
    ctx.lineTo(390, 100);
    ctx.lineTo(430, 105);
    ctx.lineTo(410, 135);
    ctx.lineTo(365, 145);
    ctx.lineTo(330, 175);
    ctx.lineTo(160, 180);
    ctx.closePath();
    ctx.fill();

    // Tête et oreilles
    ctx.beginPath();
    ctx.moveTo(350, 65);
    ctx.lineTo(355, 30);
    ctx.lineTo(375, 65);
    ctx.lineTo(395, 45);
    ctx.lineTo(395, 95);
    ctx.fill();

    // Quatre jambes
    ctx.beginPath();
    ctx.moveTo(145, 165);
    ctx.lineTo(180, 165);
    ctx.lineTo(170, 265);
    ctx.lineTo(140, 265);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(205, 165);
    ctx.lineTo(235, 165);
    ctx.lineTo(250, 265);
    ctx.lineTo(220, 265);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(290, 160);
    ctx.lineTo(320, 160);
    ctx.lineTo(315, 265);
    ctx.lineTo(285, 265);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(335, 145);
    ctx.lineTo(365, 145);
    ctx.lineTo(385, 265);
    ctx.lineTo(355, 265);
    ctx.closePath();
    ctx.fill();

    // Queue
    ctx.beginPath();
    ctx.moveTo(110, 125);
    ctx.quadraticCurveTo(65, 145, 90, 205);
    ctx.stroke();

    // Crinière
    ctx.beginPath();
    ctx.moveTo(300, 105);
    ctx.lineTo(320, 80);
    ctx.lineTo(330, 110);
    ctx.stroke();
  }

  // COEUVE : cochon bien reconnaissable
  if (type === 'pig') {
    // Corps
    ctx.beginPath();
    ctx.ellipse(240, 165, 145, 88, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tête
    ctx.beginPath();
    ctx.ellipse(370, 145, 65, 58, 0, 0, Math.PI * 2);
    ctx.fill();

    // Groin
    ctx.beginPath();
    ctx.ellipse(425, 165, 35, 27, 0, 0, Math.PI * 2);
    ctx.fill();

    // Narines découpées
    ctx.fillStyle = '#00613f';
    ctx.beginPath();
    ctx.ellipse(415, 160, 6, 11, 0, 0, Math.PI * 2);
    ctx.ellipse(438, 160, 6, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // Oreilles
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(325, 105);
    ctx.lineTo(310, 55);
    ctx.lineTo(365, 90);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(375, 100);
    ctx.lineTo(415, 55);
    ctx.lineTo(420, 120);
    ctx.closePath();
    ctx.fill();

    // Quatre pattes
    ctx.fillRect(145, 215, 38, 65);
    ctx.fillRect(225, 220, 38, 60);
    ctx.fillRect(300, 215, 38, 65);

    // Queue en tire-bouchon
    ctx.beginPath();
    ctx.arc(90, 145, 25, 0, Math.PI * 1.8);
    ctx.stroke();
  }

  // ZEKILLA : véritable sombrero mexicain
  if (type === 'sombrero') {
    // Large bord du chapeau
    ctx.beginPath();
    ctx.moveTo(65, 205);
    ctx.quadraticCurveTo(265, 155, 465, 205);
    ctx.quadraticCurveTo(265, 285, 65, 205);
    ctx.closePath();
    ctx.fill();

    // Couronne conique arrondie
    ctx.beginPath();
    ctx.moveTo(165, 190);
    ctx.quadraticCurveTo(175, 55, 265, 35);
    ctx.quadraticCurveTo(355, 55, 365, 190);
    ctx.closePath();
    ctx.fill();

    // Bande décorative
    ctx.strokeStyle = '#00613f';
    ctx.lineWidth = 13;
    ctx.beginPath();
    ctx.moveTo(170, 165);
    ctx.quadraticCurveTo(265, 185, 360, 165);
    ctx.stroke();

    // Décoration du bord
    ctx.beginPath();
    ctx.moveTo(115, 215);
    ctx.quadraticCurveTo(265, 255, 415, 215);
    ctx.stroke();
  }

  // Les autres pictogrammes restent inchangés.
  if (type === 'train') {
    ctx.beginPath();
    ctx.arc(125, 85, 24, 0, Math.PI * 2);
    ctx.arc(165, 65, 30, 0, Math.PI * 2);
    ctx.arc(205, 85, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillRect(120, 110, 35, 90);
    ctx.fillRect(100, 145, 110, 70);
    ctx.fillRect(190, 155, 210, 60);
    ctx.fillRect(335, 125, 85, 90);
    ctx.fillRect(90, 205, 350, 22);

    for (const x of [155, 255, 355]) {
      ctx.beginPath();
      ctx.arc(x, 235, 25, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillRect(80, 270, 380, 8);
  }

  if (type === 'shirt') {
    ctx.beginPath();
    ctx.moveTo(145, 65);
    ctx.lineTo(95, 100);
    ctx.lineTo(125, 155);
    ctx.lineTo(155, 140);
    ctx.lineTo(155, 265);
    ctx.lineTo(365, 265);
    ctx.lineTo(365, 140);
    ctx.lineTo(395, 155);
    ctx.lineTo(425, 100);
    ctx.lineTo(375, 65);
    ctx.lineTo(320, 85);
    ctx.lineTo(200, 85);
    ctx.closePath();
    ctx.fill();
  }

  if (type === 'fuel') {
    ctx.lineWidth = 22;
    ctx.strokeRect(120, 65, 190, 205);
    ctx.fillRect(145, 90, 140, 80);
    ctx.beginPath();
    ctx.moveTo(310, 115);
    ctx.lineTo(360, 145);
    ctx.lineTo(360, 225);
    ctx.quadraticCurveTo(360, 250, 390, 250);
    ctx.stroke();
    ctx.fillRect(110, 265, 220, 20);
  }

  if (type === 'arches') {
    ctx.lineWidth = 34;

    for (const x of [155, 290]) {
      ctx.beginPath();
      ctx.moveTo(x - 55, 265);
      ctx.quadraticCurveTo(x - 35, 40, x, 40);
      ctx.quadraticCurveTo(x + 35, 40, x + 55, 265);
      ctx.stroke();
    }
  }

  if (type === 'money') {
    ctx.strokeRect(90, 75, 350, 190);
    ctx.beginPath();
    ctx.arc(265, 170, 65, 0, Math.PI * 2);
    ctx.stroke();
    ctx.font = 'bold 95px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CHF', 265, 200);

    ctx.beginPath();
    ctx.moveTo(200, 275);
    ctx.lineTo(245, 225);
    ctx.lineTo(290, 275);
    ctx.fill();
  }

  if (type === 'crown') {
    ctx.beginPath();
    ctx.moveTo(90, 245);
    ctx.lineTo(110, 115);
    ctx.lineTo(200, 185);
    ctx.lineTo(265, 65);
    ctx.lineTo(330, 185);
    ctx.lineTo(420, 115);
    ctx.lineTo(440, 245);
    ctx.closePath();
    ctx.fill();

    ctx.fillRect(100, 260, 330, 28);

    for (const x of [110, 265, 420]) {
      ctx.beginPath();
      ctx.arc(x, x === 265 ? 55 : 105, 20, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (type === 'football') {
    ctx.beginPath();
    ctx.arc(265, 165, 120, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#00613f';

    ctx.beginPath();
    ctx.moveTo(265, 95);
    ctx.lineTo(310, 130);
    ctx.lineTo(292, 180);
    ctx.lineTo(238, 180);
    ctx.lineTo(220, 130);
    ctx.closePath();
    ctx.fill();

    const panels = [
      [265, 35], [365, 100], [330, 245],
      [165, 245], [150, 100]
    ];

    for (const [x, y] of panels) {
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
