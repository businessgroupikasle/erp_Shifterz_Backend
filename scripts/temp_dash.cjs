async function main() {
  try {
    console.log("Logging in...");
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'branchadmin', password: 'branch123' })
    });
    if (!loginRes.ok) {
      throw new Error(`Login failed: ${loginRes.status} ${await loginRes.text()}`);
    }
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log("Login successful! Token acquired.");

    console.log("Fetching dashboard data...");
    const dashRes = await fetch('http://localhost:5000/api/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!dashRes.ok) {
      throw new Error(`Dashboard request failed: ${dashRes.status} ${await dashRes.text()}`);
    }
    const dashData = await dashRes.json();
    console.log("Dashboard data fetched successfully!");
    console.log(JSON.stringify(dashData, null, 2));
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();
