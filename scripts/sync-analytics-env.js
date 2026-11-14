const fs = require("node:fs");
const path = require("node:path");

const appDirectory = path.resolve(__dirname, "..");
const localEnvPath = path.join(appDirectory, ".env.local");
const functionsEnvPath = path.join(appDirectory, "functions", ".env");

function readLocalEnvironment() {
  if (!fs.existsSync(localEnvPath)) {
    throw new Error("ingolfur/.env.local is missing. Copy .env.local.example and add your GA4 IDs.");
  }

  return Object.fromEntries(
    fs.readFileSync(localEnvPath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const separator = line.indexOf("=");
        if (separator < 1) throw new Error(`Invalid .env.local line: ${line}`);
        const key = line.slice(0, separator).trim();
        const value = line.slice(separator + 1).trim().replace(/^(['"])(.*)\1$/, "$2");
        return [key, value];
      })
  );
}

function main() {
  const environment = readLocalEnvironment();
  const measurementId = environment.GA_MEASUREMENT_ID;
  const propertyId = environment.GA_PROPERTY_ID;

  if (!measurementId || !/^G-[A-Z0-9]+$/i.test(measurementId)) {
    throw new Error("Set GA_MEASUREMENT_ID to your GA4 web-stream ID (format G-XXXXXXXXXX).");
  }
  if (!propertyId || !/^\d+$/.test(propertyId)) {
    throw new Error("Set GA_PROPERTY_ID to the numeric ID of your GA4 property.");
  }

  fs.writeFileSync(
    functionsEnvPath,
    `GA_MEASUREMENT_ID=${measurementId}\nGA_PROPERTY_ID=${propertyId}\n`,
    { encoding: "utf8", mode: 0o600 }
  );
  console.log("GA4 environment prepared for Firebase Functions. No private credentials were copied.");
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : "Could not prepare GA4 environment.");
  process.exitCode = 1;
}
