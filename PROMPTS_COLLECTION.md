# 🤖 Master Prompts Collection for Churn Early Warning System

This document contains ready-to-use, engineered prompts that you can use with AI tools (such as ChatGPT, Claude, or Gemini) to generate, customize, extend, or explain any part of your **E-Commerce Customer Churn Early Warning System** project.

---

## 📑 Table of Prompts by Category
1. [Category 1: Web Prototype UI/UX & Frontend Prompts](#category-1-web-prototype-uiux--frontend-prompts)
2. [Category 2: Machine Learning & Python Model Training Prompts](#category-2-machine-learning--python-model-training-prompts)
3. [Category 3: Reviewer Pitch & Viva Voce Preparation Prompts](#category-3-reviewer-pitch--viva-voce-preparation-prompts)
4. [Category 4: PowerPoint Presentation (PPT) Generation Prompts](#category-4-powerpoint-presentation-ppt-generation-prompts)
5. [Category 5: Academic Project Report & Documentation Prompts](#category-5-academic-project-report--documentation-prompts)

---

## 🎨 Category 1: Web Prototype UI/UX & Frontend Prompts

### Prompt 1.1: Flipkart Theme Generator & Layout
```text
Act as a Senior Frontend Engineer. Create a modern, responsive Single Page Application (SPA) in HTML, CSS, and Vanilla JavaScript inspired by Flipkart's visual design system.
Colors: Flipkart Blue (#2874F0), Plus Yellow (#FFE500), Action Orange (#FB641B), Green (#388e3c), Red (#e53935).
Include:
1. Sticky Flipkart-style navbar with search box, Plus logo, and tabs (Home, Predict Churn, Analytics, Customer Hub, Viva Hub).
2. Interactive Churn Prediction tool with real-time sliders for Account Age (Months), Usage Frequency (Orders/mo), Monthly Spend (₹), Recency (Days since order), and Complaints.
3. Semi-circular SVG Gauge Arc showing real-time Churn Probability percentage, Risk Badge (High, Medium, Low), and confidence level.
4. Explainable AI feature driver progress bars (SHAP-style) and personalized Flipkart Retention Action Cards (SuperCoins, priority callback, discounts).
5. Chart.js dashboard charts for Risk Distribution, Churn vs Tenure, and Monthly Trends.
6. Mobile-responsive layout with zero external framework dependencies.
```

### Prompt 1.2: Adding a New Preset / Persona
```text
I have a web application for E-Commerce Customer Churn. Write a JavaScript function and button HTML to add a new preset persona called "Festive Big Billion Days Shopper". 
Attributes: Account Age = 3 months, Orders = 6 orders, Monthly Spend = ₹12,500, Recency = 40 days, Complaints = 1.
Compute its expected churn risk and define 2 personalized Flipkart retention cards.
```

---

## 🧠 Category 2: Machine Learning & Python Model Training Prompts

### Prompt 2.1: Complete End-to-End Python Model Training Script
```text
Act as an Expert Data Scientist. Write a production-ready Python script for an E-Commerce Customer Churn Early Warning System using Pandas, Scikit-Learn, and XGBoost.
Requirements:
1. Load the Kaggle E-Commerce Customer Churn Dataset.
2. Perform Exploratory Data Analysis (EDA) and handle missing values in Tenure, WarehouseToHome, and DaySinceLastOrder with median imputation.
3. Encode categorical variables using One-Hot Encoding and apply Min-Max scaling to continuous features.
4. Address class imbalance (83% non-churn vs 17% churn) using SMOTE and cost-sensitive loss (`scale_pos_weight`).
5. Train and benchmark 4 models: Logistic Regression, Decision Tree, Random Forest, and XGBoost.
6. Output comprehensive evaluation metrics: ROC-AUC, Recall, Precision, F1-Score, and Confusion Matrix.
7. Compute SHAP feature importance values and print the top 5 churn driver coefficients.
```

### Prompt 2.2: Exporting Model Weights to Client-Side JavaScript
```text
I have trained an XGBoost / Logistic Regression model for customer churn in Python. Provide a Python code snippet that extracts the feature coefficients, intercepts, and scaling parameters into a JSON object so that I can execute client-side predictions in pure JavaScript using the Sigmoid transfer function.
```

---

## 🎓 Category 3: Reviewer Pitch & Viva Voce Preparation Prompts

### Prompt 3.1: 2-Minute Elevator Pitch Customizer
```text
Act as a Computer Science Professor. Write a concise, 2-minute elevator pitch for my undergraduate final year project: "E-Commerce Customer Churn Early Warning System".
Highlight:
- The business problem: Customer Acquisition Cost (CAC) is 5x to 7x higher than retention.
- Core inputs: Account Age, Usage Frequency, Monthly Spending, and Complaints.
- Key technical achievement: XGBoost model with 92.4% ROC-AUC and 89.1% Recall.
- Real-world business impact: 4.8x ROI using automated Flipkart retention playbooks (SuperCoins, priority support).
Keep the tone confident, articulate, and academically rigorous.
```

### Prompt 3.2: Tough Examiner Mock Defense
```text
Act as an aggressive External Examiner in a final year Computer Science Project Viva. Ask me the 10 toughest technical questions about my E-Commerce Customer Churn Prediction project, focusing on:
1. Why Recall is prioritized over Accuracy.
2. How class imbalance was resolved.
3. Collinearity between spending and order frequency.
4. Mathematical derivation of the Sigmoid scoring function.
5. Explainable AI and SHAP values.
For each question, provide the ideal high-scoring student response.
```

---

## 📊 Category 4: PowerPoint Presentation (PPT) Generation Prompts

### Prompt 4.1: Slide Deck Generation for Gamma / SlidesGPT
```text
Create a 12-slide presentation structure for a project titled "E-Commerce Customer Churn Early Warning System".
For each slide, provide:
1. Slide Title
2. Visual Layout & Graphic Recommendation
3. 3-4 High-impact concise bullet points
4. Exact spoken speaker notes (what the presenter should say).
Include slides on: Problem Statement (CAC vs Retention), Dataset & Features, System Architecture, ML Model Evaluation (ROC-AUC: 0.924, Recall: 89.1%), Live Flipkart Prototype Demo, Business ROI (4.8x), and Future Scope.
```

---

## 📝 Category 5: Academic Project Report & Documentation Prompts

### Prompt 5.1: Generating Case Study Report Chapters
```text
Act as a Senior Academic Technical Writer. Write Chapter 5 ("Machine Learning Methodology & Mathematical Modeling") for an Undergraduate Capstone Project Report on "E-Commerce Customer Churn Early Warning System".
Include:
1. Mathematical formulation of binary churn probability using the Sigmoid transfer function.
2. Log-odds linear predictor formula incorporating Recency, Complaints, Tenure, and Spend.
3. Comparative explanation of Bagging (Random Forest) vs Boosting (XGBoost).
4. Objective function of XGBoost with regularization terms.
Format in clean Markdown with LaTeX math notation.
```

### Prompt 5.2: Financial Business ROI Calculation
```text
Write a detailed business impact case study section for an e-commerce platform with 50,000 customers.
Model the financial savings achieved by reducing churn from a 15% baseline to 7% using an AI early warning system.
Calculate:
- Gross Lifetime Value (LTV) preserved.
- Cost of retention incentives (₹200 discount/SuperCoins per flagged user).
- Net ROI multiplier and Customer Acquisition Cost (CAC) savings.
```
