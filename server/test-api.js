// Script de prueba para verificar la API
// Ejecuta: node test-api.js

const testAPI = async () => {
  console.log("🧪 Probando API...\n");

  try {
    // Test 1: Obtener todos los tickets
    console.log("1️⃣ GET /api/tickets");
    const ticketsRes = await fetch("http://localhost:3306/api/tickets");
    const tickets = await ticketsRes.json();
    console.log("✅ Respuesta:", tickets);
    console.log(`   Total tickets: ${tickets.length}\n`);

    // Test 2: Obtener estadísticas
    console.log("2️⃣ GET /api/tickets/stats/dashboard");
    const statsRes = await fetch(
      "http://localhost:3306/api/tickets/stats/dashboard"
    );
    const stats = await statsRes.json();
    console.log("✅ Respuesta:", stats);
    console.log("\n");

    // Test 3: Crear un ticket
    console.log("3️⃣ POST /api/tickets");
    const newTicketRes = await fetch("http://localhost:3306/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Test desde script",
        description:
          "Este es un ticket de prueba creado desde el script de test",
        category: "Software",
        priority: "medium",
        createdBy: "Test User",
      }),
    });
    const newTicket = await newTicketRes.json();
    console.log("✅ Ticket creado:", newTicket);
    console.log("\n");

    console.log("✅ Todas las pruebas pasaron correctamente!");
  } catch (error) {
    console.error("❌ Error en las pruebas:", error.message);
  }
};

testAPI();
