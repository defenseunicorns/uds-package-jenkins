/**
 * Copyright 2024 Defense Unicorns
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial
 */

import { test, expect, devices } from '@playwright/test';
import path from 'path';

// Function to generate a unique screenshot filename with a custom base name
const getUniqueScreenshotPath = (baseName: string) => {
  let screenshotPath = path.resolve(__dirname, 'screenshots', `${defaultBrowserType}-${baseName}.png`);
  return screenshotPath;
};

let defaultBrowserType: string;

test.beforeEach(async ({ browserName }) => {
  // Use browserName provided by Playwright to determine the browser type
  defaultBrowserType = browserName;
});

test.describe('Jenkins Pipeline', () => {
  const randomSuffix = Math.floor(Math.random() * 10000); // Generate a random number

  test('Should create a simple pipeline and check its status', async ({ page, baseURL }) => {
    const pipelineName = `example-pipeline-${defaultBrowserType}-${randomSuffix}`;
    // Navigate to Jenkins dashboard
    await page.goto(baseURL);

    // Wait for the dashboard to load and verify login by checking for the logout button
    await page.waitForSelector('a[href="/logout"]');
    console.log('Logged in successfully using stored auth state');

    // Retrieve and print cookies
    const cookies = await page.context().cookies();
    console.log('Cookies:', cookies);

    // Wait for the "New Item" link to be visible and click it
    await page.waitForSelector('a.task-link[href="/view/all/newJob"]', { timeout: 30000 });
    console.log('New Item link is visible');

    await page.click('a.task-link[href="/view/all/newJob"]');
    console.log('Clicked on New Item link');

    // Enter pipeline name
    await page.waitForTimeout(2000);
    await page.fill('input[name="name"]', pipelineName);
    console.log(`Entered pipeline name: ${pipelineName}`);

    // Select 'Pipeline' type
    await page.click('li.org_jenkinsci_plugins_workflow_job_WorkflowJob');

    // Verify if 'Pipeline' type is checked (aria-checked="true")
    await page.waitForSelector('li.org_jenkinsci_plugins_workflow_job_WorkflowJob.active[aria-checked="true"]', { timeout: 5000 });
    console.log('Pipeline job type is checked');
    var screenshotPath = getUniqueScreenshotPath('job-page');
    await page.screenshot({ path: screenshotPath });

    // Click OK to create the pipeline
    await page.click('button[type="submit"]');
    console.log('Clicked OK to create the pipeline');

    // Wait for the configuration page to load
    await page.waitForSelector('div.jenkins-section__title#pipeline');
    console.log('Configuration page loaded');

    // Enter a simple pipeline script
    const pipelineScript = `
      pipeline {
        agent any
        stages {
          stage('Build') {
            steps {
              echo 'Building...'
            }
          }
          stage('Test') {
            steps {
              echo 'Testing...'
            }
          }
          stage('Deploy') {
            steps {
              echo 'Deploying...'
            }
          }
        }
      }
    `;
    await page.waitForTimeout(2000);
    await page.fill('.ace_text-input', pipelineScript);
    console.log('Entered pipeline script');
    await page.waitForTimeout(2000);
    screenshotPath = getUniqueScreenshotPath('pipeline-page');
    await page.screenshot({ path: screenshotPath });

    // Save the pipeline
    await page.click('button[name="Submit"]');
    console.log('Saved the pipeline configuration');

    // Run the pipeline
    await page.click(`a[href="/job/${pipelineName}/build?delay=0sec"]`);
    console.log('Triggered the pipeline build');

    // Wait for the build to start and complete
    await page.waitForTimeout(10000); // Wait for 10 seconds
    console.log('Waited for the build to complete');

    // Check the build status
    await page.goto(`/job/${pipelineName}/lastBuild`);
    console.log('Navigated to the last build page');

    // Assert that the build was successful
    await page.waitForSelector('svg[tooltip="Success"][title="Success"]', { timeout: 60000 });
    console.log('Build was successful');
    screenshotPath = getUniqueScreenshotPath('results-page');
    await page.screenshot({ path: screenshotPath });
  });
});
