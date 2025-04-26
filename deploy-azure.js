const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const resourceGroup = 'hackathon-management-rg';
const appName = 'hackathon-management-app';
const location = 'eastus';
const sku = 'F1'; // Free tier

console.log('Building the application...');
execSync('npm run build', { stdio: 'inherit' });

console.log('Creating web.config file for Azure...');
const webConfigContent = `<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <webSocket enabled="false" />
    <handlers>
      <add name="iisnode" path="server.js" verb="*" modules="iisnode"/>
    </handlers>
    <rewrite>
      <rules>
        <rule name="NodeInspector" patternSyntax="ECMAScript" stopProcessing="true">
          <match url="^server.js\/debug[\/]?" />
        </rule>
        <rule name="StaticContent">
          <action type="Rewrite" url="dist{REQUEST_URI}"/>
        </rule>
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True"/>
          </conditions>
          <action type="Rewrite" url="server.js"/>
        </rule>
      </rules>
    </rewrite>
    <security>
      <requestFiltering>
        <hiddenSegments>
          <remove segment="bin"/>
        </hiddenSegments>
      </requestFiltering>
    </security>
    <httpErrors existingResponse="PassThrough" />
  </system.webServer>
</configuration>`;

fs.writeFileSync('web.config', webConfigContent);

console.log('Creating .deployment file...');
const deploymentContent = `[config]
SCM_DO_BUILD_DURING_DEPLOYMENT=true`;

fs.writeFileSync('.deployment', deploymentContent);

try {
  // Check if the resource group exists
  console.log(`Checking if resource group ${resourceGroup} exists...`);
  try {
    execSync(`az group show --name ${resourceGroup}`, { stdio: 'ignore' });
    console.log(`Resource group ${resourceGroup} already exists.`);
  } catch (error) {
    console.log(`Creating resource group ${resourceGroup}...`);
    execSync(`az group create --name ${resourceGroup} --location ${location}`, { stdio: 'inherit' });
  }

  // Create or update the web app
  console.log(`Creating or updating web app ${appName}...`);
  execSync(
    `az webapp up --name ${appName} --resource-group ${resourceGroup} --location ${location} --sku ${sku} --html`,
    { stdio: 'inherit' }
  );

  console.log(`\nDeployment complete! Your app is available at: https://${appName}.azurewebsites.net`);
} catch (error) {
  console.error('Deployment failed:', error.message);
  process.exit(1);
} 