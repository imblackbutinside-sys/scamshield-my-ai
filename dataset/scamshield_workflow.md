# 🛡️ ScamShield MY Workflow Infographic

Here is the visual workflow for ScamShield MY, illustrating how input is processed from the initial stage through to the final result generation and AI explainability.

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
    
    A["📱 1. USER INPUT (Text, URL, Phone Number)"]:::inputNode
    A --> B{"Input Type?"}:::decisionNode
    
    B -->|"Text / Message"| C1["💬 Text Message"]:::processNode
    B -->|"Web Link"| C2["🔗 URL Link"]:::processNode
    B -->|"Account / Phone"| C3["📱 Entity Record"]:::processNode
    
    %% Text Pipeline (Main NLP)
    C1 --> N1["🔍 LAYER 1: Pattern Matching (TF-IDF Kaggle Corpus)"]:::nlpNode
    N1 --> N2["⚠️ LAYER 2: Sentiment & Psychology (Lexicon Engine)"]:::nlpNode
    N2 --> N3["🧠 LAYER 3: Gemini AI Agent (Deep Context Analysis)"]:::nlpNode
    
    %% URL & Phone Pipeline
    C2 --> U1["🌐 Detect Typosquatting & Risky Structures"]:::processNode
    U1 --> N3
    
    C3 --> P1["🗃️ Synthetic Mule Account Dataset Check"]:::processNode
    P1 --> N3
    
    %% Decision
    N3 --> O1{"Final Risk Score (0-100%)"}:::decisionNode
    
    O1 -->|"High Risk > 70%"| R1["🔴 HIGH PROBABILITY SCAM"]:::outputScam
    O1 -->|"Medium Risk 40-70%"| R2["🟠 SUSPICIOUS ACTIVITY"]:::highlight
    O1 -->|"Low Risk < 40%"| R3["🟢 LIKELY SAFE"]:::outputSafe
    
    %% AI Explainability
    R1 -.-> EXP["📝 AI EXPLAINABILITY CARD (Highlighting Scam Keywords)"]
    R2 -.-> EXP
```
> [!NOTE]  
> The chart above summarizes the data flow that we will build in **Vanilla JavaScript** (for Layer 1 and 2) up to the API integration (for Layer 3).
