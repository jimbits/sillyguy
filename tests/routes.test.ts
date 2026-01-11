const BASE_URL = "http://localhost:5000";

const tests = [
  { path: "/", expected: 200, name: "Home page" },
  { path: "/contact", expected: 200, name: "Contact page" },
  { path: "/login", expected: 200, name: "Login page" },
  { path: "/dashboard", expected: 200, name: "Dashboard page" },
  { path: "/nonexistent", expected: 404, name: "404 page" },
  { path: "/css/global.css", expected: 200, name: "CSS file" },
];

async function testRoutes() {
  console.log("🧪 Testing routes...\n");

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const response = await fetch(`${BASE_URL}${test.path}`);
      const status = response.status;

      if (status === test.expected) {
        console.log(`✅ ${test.name}: ${status}`);
        passed++;
      } else {
        console.log(
          `❌ ${test.name}: Expected ${test.expected}, got ${status}`
        );
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}: Connection failed - Is server running?`);
      failed++;
    }
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

testRoutes();
