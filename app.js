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
  const protecciones = getCheckedValues("proteccion");

  const rawExposure =
    datos.reduce((acc, item) => acc + item.points, 0) +
    canales.reduce((acc, item) => acc + item.points, 0);

  const protectionDiscount = protecciones.reduce((acc, item) => acc + item.points, 0);

  // Escala acotada entre 0 y 100
  const finalScore = Math.max(0, Math.min(100, rawExposure - Math.round(protectionDiscount * 0.6)));

  let levelText = "Exposición baja";
  let levelClass = "risk-bajo";
  let summaryText =
    "Tu exposición digital identificada es baja. Mantén estas buenas prácticas y revisa periódicamente tus perfiles.";

  if (finalScore >= 60) {
    levelText = "Exposición alta";
    levelClass = "risk-alto";
    summaryText =
      "Tu negocio expone información clave en canales abiertos y presenta pocas medidas de resguardo. Se recomienda aplicar ajustes inmediatos de privacidad.";
  } else if (finalScore >= 30) {
    levelText = "Exposición media";
    levelClass = "risk-medio";
    summaryText =
      "Existen datos comerciales o de contacto visibles que pueden facilitar llamadas o mensajes sospechosos. Conviene reforzar configuraciones de privacidad.";
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
  if (protecciones.length === 0) {
    recommendations.push(
      "Inicia hoy al menos dos acciones de protección: separar el número personal y configurar la privacidad de tus cuentas."
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
