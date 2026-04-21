# 🛡️ ScamShield MY Workflow Infographic

Here is the visual workflow for ScamShield MY, illustrating how input is processed from the initial stage through to the final result generation and AI explainability. This workflow has been updated to include full dataset integration including transactions and emails.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#1e293b', 'primaryTextColor': '#fff', 'primaryBorderColor': '#334155', 'lineColor': '#CBD5E1', 'secondaryColor': '#0f172a', 'tertiaryColor': '#3b82f6' }}}%%
flowchart TD
    %% Styling Classes
    classDef inputNode fill:#3b82f6,color:#fff,stroke:#2563eb,stroke-width:2px,rx:10px
    classDef processNode fill:#334155,color:#f8fafc,stroke:#475569,stroke-width:2px,rx:10px
    classDef nlpNode fill:#6366f1,color:#fff,stroke:#4f46e5,stroke-width:2px,rx:10px
    classDef decisionNode fill:#eab308,color:#000,stroke:#ca8a04,stroke-width:2px,rx:10px
    classDef outputSafe fill:#22c55e,color:#fff,stroke:#16a34a,stroke-width:2px,rx:10px
    classDef outputScam fill:#ef4444,color:#fff,stroke:#dc2626,stroke-width:2px,rx:10px
    classDef highlight fill:#fbbf24,color:#000,stroke:#d97706,stroke-width:2px,rx:5px
    
    A["📱 1. USER INPUT"]:::inputNode
    A --> B{"Input Type?"}:::decisionNode
    
    B -->|"Text / Message"| C1["💬 Text Message"]:::processNode
    B -->|"Web Link"| C2["🔗 URL Link"]:::processNode
    B -->|"Account / Phone"| C3["📱 Call / Number"]:::processNode
    B -->|"Financial"| C4["💳 Transaction ID"]:::processNode
    B -->|"Emails"| C5["✉️ Phishing Email"]:::processNode
    
    %% Local DB Check (Layer 1)
    C1 --> N1["🔍 LAYER 1: Local Pattern Check (Spam CSV)"]:::processNode
    C2 --> U1["🌐 LAYER 0 & 1: Obfuscation & URLHaus Lookups"]:::processNode
    C4 --> P2["🗃️ LAYER 1: Fraud Indicator DB Lookup"]:::processNode
    
    %% AI Pipeline (Layer 2)
    N1 --> N3["🧠 LAYER 2: Llama-3 AI Fallback (Deep Context)"]:::nlpNode
    U1 --> N3
    C3 --> N3
    C5 --> N3
    
    %% Decision
    P2 --> O1{"Final Status Judgment"}:::decisionNode
    N3 --> O1
    
    O1 -->|"Match Found / High Risk"| R1["🔴 SCAM DETECTED"]:::outputScam
    O1 -->|"Uncertain Context"| R2["🟠 SUSPICIOUS ACTIVITY"]:::highlight
    O1 -->|"Verified / Low Risk"| R3["🟢 LIKELY SAFE"]:::outputSafe
    
    %% AI Explainability
    R1 -.-> EXP["📝 MULTI-LINGUAL REPORT CARD (Why & Action)"]
    R2 -.-> EXP
```
> [!NOTE]  
> The chart above outlines the comprehensive 3-stage validation process that routes offline/locally cached logic (Layer 0 and 1) swiftly, preserving standard rate limits by only pinging Groq's Llama-3 AI Engine (Layer 2) when processing nuanced structures like Emails and Social Engineering patterns.
