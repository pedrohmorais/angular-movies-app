#!/bin/bash

# Cypress E2E Test Runner Script
# This script helps run Cypress tests in various ways

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=====================================
Angular Movies App - Cypress E2E Tests
=====================================${NC}\n"

# Function to check if dependencies are installed
check_dependencies() {
  if ! command -v cypress &> /dev/null; then
    echo -e "${RED}Error: Cypress is not installed.${NC}"
    echo "Install it with: npm install --save-dev cypress"
    exit 1
  fi
  echo -e "${GREEN}✓ Cypress is installed${NC}"
}

# Function to check if app is running
check_app_running() {
  if ! curl -s http://localhost:4200 > /dev/null 2>&1; then
    echo -e "${RED}Error: App is not running at http://localhost:4200${NC}"
    echo "Start it with: npm start"
    exit 1
  fi
  echo -e "${GREEN}✓ App is running at http://localhost:4200${NC}"
}

# Main menu
show_menu() {
  echo -e "${BLUE}Select test mode:${NC}"
  echo "1) Open Interactive Test Runner (UI Mode)"
  echo "2) Run all tests in headless mode"
  echo "3) Run search-batman tests only"
  echo "4) Run with video recording"
  echo "5) Check dependencies and app status"
  echo "6) Exit"
  echo ""
  read -p "Enter your choice (1-6): " choice
}

# Run based on choice
run_tests() {
  case $choice in
    1)
      echo -e "${BLUE}Opening Cypress Test Runner...${NC}\n"
      npx cypress open
      ;;
    2)
      echo -e "${BLUE}Running all tests in headless mode...${NC}\n"
      check_dependencies
      check_app_running
      npx cypress run
      ;;
    3)
      echo -e "${BLUE}Running search-batman tests...${NC}\n"
      check_dependencies
      check_app_running
      npx cypress run --spec "cypress/e2e/search-batman.cy.ts"
      ;;
    4)
      echo -e "${BLUE}Running tests with video recording...${NC}\n"
      check_dependencies
      check_app_running
      npx cypress run --record=false --video
      ;;
    5)
      echo -e "${BLUE}Checking dependencies and app status...${NC}\n"
      check_dependencies
      check_app_running
      echo -e "${GREEN}All checks passed!${NC}"
      ;;
    6)
      echo "Exiting..."
      exit 0
      ;;
    *)
      echo -e "${RED}Invalid option. Please select 1-6.${NC}"
      show_menu
      run_tests
      ;;
  esac
}

# Main execution
show_menu
run_tests

echo -e "\n${GREEN}Test execution completed!${NC}"
