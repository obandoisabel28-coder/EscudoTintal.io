const form = document.getElementById("diagnostic-form");
const resetBtn = document.getElementById("btn-reset");
const placeholder = document.getElementById("result-placeholder");
const resultContent = document.getElementById("result-content");
const riskBadge = document.getElementById("risk-badge");
const scoreValue = document.getElementById("score-value");
const riskSummary = document.getElementById("risk-summary");
const recList = document.getElementById("recommendations-list");

function getCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(
    (el) => ({
      label: el.parentElement.textContent.trim(),
      points: Number(el.value)
    })
  );
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const datos = getCheckedValues("dato");
  const canales = getCheckedValues("canal");
  const riesgosExtra = getCheckedValues("riesgo_extra");
  const protecciones = getCheckedValues("proteccion");

  // Suma de exposición (datos + canales + factores operativos adicionales)
  const rawExposure =
    datos.reduce((acc, item) => acc + item.points, 0) +
    canales.reduce((acc, item) => acc + item.points, 0) +
    riesgosExtra.reduce((acc, item) => acc + item.points, 0);

  // Descuento por medidas de protección marcadas
  const protectionDiscount = protecciones.reduce((acc, item) => acc + item.points, 0);

  // Escala calibrada entre 0 y 100
  const adjustedScore = (rawExposure - protectionDiscount * 0.5) * 0.65;
  const finalScore = Math.max(0, Math.min(100, Math.round(adjustedScore)));

  let levelText = "Exposición baja";
  let levelClass = "risk-bajo";
  let summaryText =
    "Tu exposición digital identificada es baja. Mantén estas buenas prácticas y revisa periódicamente tus perfiles.";

  if (finalScore >= 60) {
    levelText = "Exposición alta";
    levelClass = "risk-alto";
    summaryText =
      "Tu negocio presenta una exposición elevada o factores operativos de vulnerabilidad ante contacto extorsivo. Se recomienda aplicar medidas de protección de inmediato.";
  } else if (finalScore >= 30) {
    levelText = "Exposición media";
    levelClass = "risk-medio";
    summaryText =
      "Existen datos o rutinas visibles que pueden ser aprovechados por desconocidos. Reforzar tu privacidad y protocolos reducirá el riesgo.";
  }

  const recommendations = [];

  if (datos.some((d) => d.label.includes("Número de teléfono"))) {
    recommendations.push(
      "Evita publicar tu número personal en redes o volantes; usa un canal comercial separado y activa la verificación en dos pasos en WhatsApp."
    );
  }
  if (datos.some((d) => d.label.includes("Dirección exacta") || d.label.includes("Horarios"))) {
    recommendations.push(
      "Revisa si es necesario mostrar horarios fijos o datos de ubicación sensible en publicaciones públicas."
    );
  }
  if (canales.some((c) => c.label.includes("Facebook") || c.label.includes("WhatsApp"))) {
    recommendations.push(
      "Restringe quién puede ver tus estados, fotografías y listas de contactos en WhatsApp y redes sociales."
    );
  }
  if (riesgosExtra.some((r) => r.label.includes("números desconocidos"))) {
    recommendations.push(
      "Verifica siempre el origen de pedidos o cotizaciones de números desconocidos y evita confirmar datos personales o financieros."
    );
  }
  if (riesgosExtra.some((r) => r.label.includes("rutinas diarias"))) {
    recommendations.push(
      "No publiques horarios de apertura, cierre, arqueos de caja ni recorridos de domicilios en estados o redes abiertas."
    );
  }
  if (riesgosExtra.some((r) => r.label.includes("empleados, familiares"))) {
    recommendations.push(
      "Capacita a quienes atienden el WhatsApp o redes del negocio sobre cómo manejar mensajes sospechosos y no entregar información sensible."
    );
  }
  if (riesgosExtra.some((r) => r.label.includes("directorios abiertos"))) {
    recommendations.push(
      "Audita tus perfiles públicos, directorios y anuncios para retirar datos personales innecesarios."
    );
  }
  if (riesgosExtra.some((r) => r.label.includes("miércoles, jueves y viernes"))) {
    recommendations.push(
      "Refuerza la atención preventiva en los horarios y días de mayor actividad comercial en el sector (tardes/noches y mitad/fin de semana)."
    );
  }
  if (!protecciones.some((p) => p.label.includes("verificación en dos pasos"))) {
    recommendations.push(
      "Activa la verificación en dos pasos en WhatsApp y ajusta la privacidad de tus cuentas para prevenir suplantaciones."
    );
  }
  if (!protecciones.some((p) => p.label.includes("Línea 165"))) {
    recommendations.push(
      "Guarda en tu teléfono la Línea 165 (GAULA) y el contacto del CAI Tintal para actuar sin improvisar ante cualquier amenaza."
    );
  }
  if (recommendations.length === 0) {
    recommendations.push(
      "Continúa auditando qué información aparece sobre tu comercio en buscadores y directorios locales."
    );
  }

  riskBadge.textContent = levelText;
  riskBadge.className = `risk-pill ${levelClass}`;
  scoreValue.textContent = `${finalScore} / 100`;
  riskSummary.textContent = summaryText;

  recList.innerHTML = "";
  recommendations.forEach((rec) => {
    const li = document.createElement("li");
    li.textContent = rec;
    recList.appendChild(li);
  });

  placeholder.classList.add("hidden");
  resultContent.classList.remove("hidden");
});

resetBtn.addEventListener("click", () => {
  resultContent.classList.add("hidden");
  placeholder.classList.remove("hidden");
});
