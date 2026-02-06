# Profile Subtype Configuration Instructions

This document contains detailed instructions for configuring each profile subtype.

## DLP > Fingerprint Rules

### Overview
The Fingerprinting Rule Threshold allows you to configure the similarity of the fingerprint match. The recommended default value is 70%. A similarity level of 100% means identical to the fingerprinted document. Setting this too high may miss variances of the original document while a lower percentage may generate false positives.

### Configuration Fields

| Field | Type | Description | Requirements |
|-------|------|-------------|--------------|
| **Rule Name** | Text Input | The name of the fingerprinting rule | Required |
| **Threshold** | Slider | Similarity percentage for fingerprint matching | Range: 70% - 100%, Default: 70% |

### Instructions
1. Enter a descriptive **Rule Name** for the fingerprinting rule
2. Set the **Threshold** slider to define the similarity level:
   - **70%** (Recommended Default): Balanced setting that detects most variations while minimizing false positives
   - **Higher (80-100%)**: More strict matching, may miss document variations
   - **Lower (<70%)**: More lenient matching, may generate more false positives

### Best Practices
- Start with the default 70% threshold
- Adjust based on your specific use case and tolerance for false positives/negatives
- Document changes for audit purposes

---

## Custom Categories

### Overview
Custom Categories allow you to define new categories and combine existing categories and URL/Destination profiles using OR and AND NOT operators.

### Configuration Fields

| Field | Type | Description | Requirements |
|-------|------|-------------|--------------|
| **Custom Category Name** | Text Input | The name of the custom category | Required |
| **Description** | Text Area | Optional description of the category | Optional |
| **Category** | Dropdown/Select | Select existing categories | Selectable with OR operator |
| **URL/Destination Profile** | Dropdown/Select | Select URL lists or destination profiles | Selectable with OR/AND NOT operators |

### Instructions
1. Enter a **Custom Category Name**
2. Optionally add a **Description**
3. In the **Definition** section:
   - Click "Category = Select" to choose categories (OR operator applied)
   - Click "URL/Destination Profile = Select" to choose profiles
   - Use **AND NOT** operator to exclude profiles
   - The OR operator is applied to multiple selections within a single criterion

### Best Practices
- Use descriptive names for custom categories
- Document the purpose of the category in the description
- Use OR for inclusive selections and AND NOT for exclusions

---

