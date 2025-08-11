# FinalProjectCSP451 – RetailOps Multi-Container Application Deployment

##  Overview
This project deploys a **multi-container retail platform** using **Docker Compose** on an **Azure VM**.  
It integrates backend APIs, a customer-facing frontend, and Azure cloud services for event-driven processing, secure secret storage, and monitoring.

**Main Components:**
- **Frontend** – Customer-facing UI.
- **Product API** – Manages product data.
- **Inventory API** – Tracks stock levels.
- **Azure Functions** – Event processing.
- **Azure Key Vault** – Secure secret storage (optional).
- **Application Insights** – Monitoring and logging.

---

##  Architecture

**Flow:**
```
Frontend ⇄ Product API ⇄ Inventory API ⇄ Azure Functions ⇄ Azure Storage Queue
```

**Services:**
1. **Frontend** – Handles client requests and communicates with backend APIs.
2. **Product API** – Provides product-related endpoints.
3. **Inventory API** – Manages and updates inventory data.

---

##  Setup Instructions

### **1. Clone the Repository**
```bash
git clone <repo-url>
cd retail-platform
```

### **2. Build & Start Containers**
```bash
docker compose up -d --build
```

### **3. Verify Running Containers**
```bash
docker ps
```
**Expected Output:**
| Service        | Port   |
|----------------|--------|
| frontend       | 8080   |
| product-api    | 5002   |
| inventory-api  | 5001   |

### **4. Test Services**
```bash
# Health check for Inventory API
curl http://<VM_PUBLIC_IP>:5001/health

# Health check for Product API
curl http://<VM_PUBLIC_IP>:5002/health
```

---

##  Azure Function Integration
The system connects to an **HTTP-triggered Azure Function** that enqueues product updates.

**Example Request:**
```bash
curl -X POST "https://<func-app>.azurewebsites.net/api/retailHttpTrigger?productId=sku-999&stock=90&name=Blooming%20Tee&x-api-key=dev-key-001&code=<FUNCTION_KEY>"
```

---

##  Security
- **API access** secured with `x-api-key` headers.
- **Function access** controlled via **Function Keys**.
- Optional **Azure Key Vault** integration for secrets management.

---

##  Monitoring
- **Application Insights** – Logs and metrics.
- **Azure Monitor Alerts** – Error tracking and performance alerts.
- Logs available via **Azure Monitor → Logs**.

---

##  Proof of Deployment
Screenshots available in `/docs`:

1. `docker-ps.png` – Running containers.
2. `curl-tests.png` – Successful health checks.
3. `azure-function-test.png` – Trigger execution log.
4. `gui-update-health.png` – GUI update & health status.
5. `key-vault.png` – Azure Key Vault integration.
6. `retail-dashboard.png` – Retail dashboard view.
7. `architecurediagram` - Detailed Diagram
