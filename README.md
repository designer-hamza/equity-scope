# Equity Scope

Build a modern, professional financial analysis web application designed to analyze publicly listed companies and present their financial health, performance, valuation, and key investment metrics in an intuitive dashboard.

The product should feel like a serious financial research and investment-analysis platform rather than a generic AI website. Take visual inspiration from professional financial terminals, equity research platforms, and modern SaaS dashboards.

1. Core Product Concept

The website will allow a user to:

Search for a publicly listed company by company name or ticker symbol.

Open a dedicated company analysis page.

View the company's financial information and key metrics.

Analyze historical financial performance through interactive charts and graphs.

View profitability, growth, liquidity, leverage, efficiency, valuation, and cash-flow metrics.

Eventually receive an AI-generated assessment of the company's financial health.

Compare companies and financial metrics.

Track companies and save them to a watchlist.

Eventually receive continuously updated financial information from external financial-data APIs.

For this initial build, create the complete frontend experience and application structure. Use realistic mock/demo data where real API data is not yet connected. Clearly structure the application so that real-time financial APIs can be connected later without redesigning the interface.

Do NOT pretend that mock data is real-time data.

2. Overall Design

Use a clean, premium, institutional-finance aesthetic.

Design principles:

Professional

Minimal

Data-dense but easy to understand

Modern SaaS interface

Excellent typography

Strong visual hierarchy

Responsive on desktop, tablet, and mobile

Light and dark mode support

Avoid excessive gradients, animations, or decorative elements

Prioritize financial data and readability

Use a professional financial color system with neutral backgrounds and restrained accent colors.

The application should feel suitable for:

Individual investors

Finance students

Equity researchers

Investment professionals

Financial analysts

3. Main Navigation

Create a persistent sidebar/navigation system containing:

Dashboard

Company Search

Watchlist

Company Comparisons

Market Overview

Financial Reports

Saved Analyses

Settings

At the bottom of the sidebar show:

User profile

Account settings

Theme toggle

4. Landing / Home Page

Create a professional homepage introducing the platform.

Hero section:

Headline:

"Analyze Companies. Understand Value."

Subheadline:

"An intelligent financial analysis platform that turns company data into clear, actionable insights."

Include a prominent company search bar:

"Search company or ticker..."

Example searches:

Apple

Microsoft

NVIDIA

Tesla

Amazon

JPMorgan

Below the search bar, show a small disclaimer:

"Financial information is provided for research and educational purposes and should not be considered investment advice."

Add a section showing platform capabilities:

Financial Health Analysis

Interactive Financial Charts

Valuation Analysis

Profitability Analysis

Growth Analysis

Risk Analysis

Company Comparison

AI-Powered Insights

5. Main Dashboard

Create a dashboard that gives the user an overview of the companies they follow.

Include:

Portfolio / Watchlist Summary

Cards showing:

Companies tracked

Average revenue growth

Average profit margin

Average ROE

Average debt-to-equity

Average valuation

Watchlist

Display companies in a table with:

Company

Ticker

Current Price

Market Cap

Revenue Growth

EPS Growth

P/E

ROE

Debt/Equity

Financial Health Score

Last Updated

Use realistic mock data.

Market Overview

Create cards/charts for:

Major market indices

Market performance

Sector performance

Top gainers

Top losers

Use mock data initially.

6. Company Search

Create a dedicated company-search page.

The search interface should allow users to search by:

Company name

Stock ticker

Exchange

Show search results as professional company cards containing:

Company logo placeholder

Company name

Ticker

Exchange

Sector

Industry

Country

Clicking a company should open its dedicated analysis dashboard.

7. Company Analysis Page

This is the most important part of the application.

Create a comprehensive company analysis dashboard.

At the top display:

Company logo

Company name

Ticker

Exchange

Sector

Industry

Country

Current stock price

Daily percentage change

Market capitalization

Last updated timestamp

Buttons:

Add to Watchlist

Compare

Export Report

8. Company Overview

Create an overview section containing cards for:

Market Cap

Enterprise Value

Revenue

EBITDA

Net Income

EPS

Free Cash Flow

Cash

Total Debt

Each metric should display:

Current value

Previous period value

Percentage change

Small trend indicator

9. Financial Performance

Create an interactive financial-performance section.

Charts should include:

Revenue

Historical revenue chart covering multiple years.

Net Income

Historical net income chart.

EBITDA

Historical EBITDA chart.

Free Cash Flow

Historical free cash flow chart.

Allow users to switch between:

5Y

10Y

Quarterly

Annual

Charts should have tooltips and interactive hover states.

10. Profitability Analysis

Create a dedicated profitability section.

Display:

Gross Margin

Operating Margin

EBITDA Margin

Net Profit Margin

ROA

ROE

ROIC

Use a combination of:

KPI cards

Trend charts

Historical comparisons

Clearly indicate whether each metric is:

Improving

Stable

Declining

11. Growth Analysis

Create a growth dashboard showing:

Revenue Growth

EPS Growth

EBITDA Growth

Free Cash Flow Growth

Book Value Growth

Display historical trends using charts.

Include a simple visual summary:

"Growth Profile"

with an overall rating such as:

Strong Growth
Moderate Growth
Stable
Declining

This should initially be based on mock data and should later be replaceable by calculated metrics from real financial data.

12. Balance Sheet & Financial Health

Create a financial-health section showing:

Liquidity

Current Ratio

Quick Ratio

Cash Ratio

Leverage

Debt/Equity

Debt/EBITDA

Interest Coverage

Net Debt

Solvency

Total Debt

Total Assets

Total Liabilities

Shareholders' Equity

Use charts to show how debt, cash, and equity have changed historically.

13. Cash Flow Analysis

Create a dedicated cash-flow section.

Display:

Operating Cash Flow

Capital Expenditure

Free Cash Flow

Financing Cash Flow

Investing Cash Flow

Create historical charts showing cash-flow trends.

Highlight important changes automatically in the UI.

For example:

"Free cash flow has improved significantly over the last three years."

This text should eventually be generated dynamically from the underlying financial data.

14. Valuation Analysis

Create a valuation dashboard.

Display:

P/E

Forward P/E

Price/Sales

Price/Book

EV/EBITDA

EV/Sales

PEG Ratio

Dividend Yield

Create comparison functionality against:

Historical company valuation

Industry average

Sector average

Use charts to visualize valuation differences.

15. AI Financial Health Summary

Create a prominent section called:

"Financial Health Assessment"

This section should eventually contain an AI-generated analysis based on the company's actual financial data.

Create the UI now.

Include:

Overall Financial Health Score

Example:

82 / 100

Categories

Profitability
Growth
Liquidity
Leverage
Cash Flow
Valuation

Each category should have:

Score

Rating

Short explanation

Also include:

"Key Strengths"

and

"Key Risks"

For now, use clearly labeled mock analysis.

Structure the frontend so this section can later receive dynamically generated analysis from an AI backend.

16. Financial Statements

Create a professional financial-statement interface.

Tabs:

Income Statement

Balance Sheet

Cash Flow Statement

Allow users to switch between:

Annual

Quarterly

Display financial statements in clean tables.

Include:

Revenue

Cost of Revenue

Gross Profit

Operating Expenses

Operating Income

Interest Expense

Pre-Tax Income

Taxes

Net Income

For the balance sheet include:

Cash

Accounts Receivable

Inventory

Total Current Assets

Property, Plant & Equipment

Total Assets

Current Liabilities

Long-Term Debt

Total Liabilities

Shareholders' Equity

For cash flow include:

Operating Cash Flow

Capital Expenditures

Investing Cash Flow

Financing Cash Flow

Free Cash Flow

17. Company Comparison

Create a comparison page where users can select multiple companies.

Allow comparison of up to 5 companies.

Comparison metrics should include:

Market Cap

Revenue

Revenue Growth

EBITDA Margin

Net Margin

ROE

ROIC

Debt/Equity

Free Cash Flow

P/E

EV/EBITDA

Dividend Yield

Present the comparison using:

Tables

Bar charts

Relative performance charts

Highlighted best/worst metrics

18. Charts & Data Visualization

The platform should heavily utilize professional data visualization.

Support:

Line charts

Bar charts

Area charts

KPI cards

Comparison charts

Trend indicators

Ratio charts

Historical performance charts

Charts should be interactive and responsive.

Users should be able to hover over data points and see exact values.

Avoid unnecessary 3D charts.

Financial charts should prioritize clarity over decoration.

19. Real-Time Data Architecture

Design the application so that financial information can eventually be retrieved from external APIs.

Create a clear data architecture separating:

Frontend
↓
Backend/API layer
↓
Financial data provider
↓
Database/cache
↓
Analysis engine
↓
AI analysis layer

Do not hard-code financial information into individual UI components.

Create reusable data structures and components so that mock data can later be replaced by API data.

The application should eventually support:

Stock prices

Market capitalization

Financial statements

Earnings

Ratios

Historical prices

Company information

Analyst estimates where available

Market/sector data

Include "Last Updated" timestamps throughout the interface.

20. Data Reliability

The future application must distinguish between:

Live market data

Delayed market data

Historical financial data

Estimated data

AI-generated analysis

Create UI elements that can communicate the source and freshness of data.

For example:

"Last updated: 16 Aug 2026, 4:05 PM"

"Source: Financial Data API"

Do not fabricate real-time information.

21. Database-Ready Architecture

Structure the application so it can later use a database containing:

Companies
Financial Statements
Financial Metrics
Historical Prices
Market Data
User Watchlists
Saved Analyses
Company Comparisons

Create clean reusable types/interfaces for these entities.

22. Authentication

Create the UI structure for:

Sign up

Login

Forgot password

User profile

Users should eventually be able to save:

Watchlists

Companies

Comparisons

Reports

Analysis history

For the initial prototype, authentication can be mocked if necessary.

23. Report Generation

Create an "Export Report" button on company-analysis pages.

The eventual functionality should allow users to generate a professional company-analysis report containing:

Company overview

Financial performance

Profitability

Growth

Liquidity

Leverage

Cash flow

Valuation

Financial health score

AI analysis

Key risks

Key strengths

For now, create the interface/button and structure required for this feature.

24. Important Technical Requirements

Build the application using a clean, modular architecture.

Use reusable components for:

KPI cards

Financial charts

Data tables

Company headers

Metric cards

Analysis sections

Rating indicators

Navigation

Search

Filters

Avoid duplicating components.

Keep financial calculations separate from presentation components.

Make the application easy to connect to external APIs later.

Do not build a fake "real-time" system that simply changes random numbers.

The current version should use clearly identified demo/mock data until actual financial APIs are connected.

25. User Experience

The user should be able to go from:

Homepage
→ Search company
→ Select company
→ Company dashboard
→ Analyze financial health
→ Explore financial statements
→ Analyze valuation
→ Compare with competitors
→ Save company
→ Export report

This should feel like one cohesive product.

26. Initial Demo Company

Use Apple (AAPL) as the primary demo company.

Populate the interface with realistic-looking demonstration data for:

Revenue

Net income

EBITDA

Free cash flow

EPS

Margins

ROE

ROIC

Debt

Cash

Valuation multiples

Clearly mark this as DEMO DATA wherever appropriate.

Do not imply that the demo values are live market data.

27. Final Product Goal

The long-term vision is to build an intelligent financial-analysis platform where a user can enter almost any publicly listed company and receive a comprehensive, data-driven assessment of its financial condition and investment characteristics.

The frontend you create now should therefore be designed as the foundation for that larger system.

Prioritize:

Excellent UI/UX

Professional financial dashboard

Reusable components

Clean data architecture

API-ready structure

Interactive charts

Financial statement presentation

Company comparison

AI-analysis interface

Scalability

Start by building the complete frontend experience with high-quality demo data and a polished professional interface. Do not worry about connecting paid financial APIs yet. The architecture should make that integration straightforward later.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d7258468-a5b3-4915-93fd-3d8de6149e9f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
