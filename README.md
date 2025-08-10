# FinalProjectCSP451
# RetailOps Multi-Container Application Deployment

##  Overview
This project deploys a multi-container retail platform using *Docker Compose* on an Azure VM.  
The system consists of:
- *Frontend* (customer-facing UI)
- *Product API* (manages product data)
- *Inventory API* (tracks stock levels)

The platform is designed to integrate with Azure Functions for event processing, with optional secure secrets storage via Azure Key Vault and monitoring via Application Insights.

---

##  Architecture
*Flow:*
Frontend ⇄ Product API ⇄ Inventory API ⇄ Azure Functions ⇄ Azure Storage/Queue

*Services:*
1. *Frontend* – Handles client requests and communicates with backend APIs.
2. *Product API* – Provides product-related endpoints.
3. *Inventory API* – Manages and updates inventory data.

---

##  Setup Instructions

### *1. Clone the Repository*
```bash
git clone <repo-url>
cd retail-platform
2. Build & Start Containers
docker compose up -d --build

3. Verify Running Containers
docker ps
Expected output:
frontend - PORT: 8080
product-api - PORT: 5002
inventory-api - PORT: 5001

4. Test Services
# Health check for Inventory API
curl http://<VM_PUBLIC_IP>:5001/health

# Health check for Product API
curl http://<VM_PUBLIC_IP>:5002/health

Azure Function Integration
The system connects to an HTTP-triggered Azure Function that enqueues product updates.

Example request:
curl -X POST "https://<func-app>.azurewebsites.net/api/retailHttpTrigger?productId=sku-999&stock=90&name=Blooming%20Tee&x-api-key=dev-key-001&code=<FUNCTION_KEY>"

Security
API access is secured with x-api-key headers.
Function access controlled via Function Keys.
Optionally integrate Azure Key Vault for storing secrets.

Monitoring
Application Insights configured for logs and metrics.
Alerts set for error tracking and performance monitoring.
Logs can be viewed in Azure Monitor → Logs.

**Proof of Deployment**
Screenshots included in the /docs folder:

1. docker-ps.png – Running containers
2. curl-tests.png – Successful health checks
3. azure-function-test.png – Trigger execution log
4. GUI- Update & Health
5. Key Vault
6. Retail Dashboard
