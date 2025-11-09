import { TableClient, AzureNamedKeyCredential } from "@azure/data-tables";

// This file initializes the client for your Azure Table Storage
// It will be used by your API routes to read/write chat history

export const getTableClient = () => {
  // useRuntimeConfig() works here because this is a server-only file
  const config = useRuntimeConfig();

  const accountName = config.azureStorageAccountName;
  const accountKey = config.azureStorageAccountKey;
  const tableName = "chatHistory"; // You can name this whatever you like

  if (!accountName || !accountKey) {
    throw new Error("Azure Storage credentials are not set in runtimeConfig");
  }

  const credential = new AzureNamedKeyCredential(accountName, accountKey);
  const endpoint = `https://${accountName}.table.core.windows.net`;

  const client = new TableClient(endpoint, tableName, credential);

  // Ensure the table exists. Does not fail if it already exists.
  client.createTable().catch(() => {});

  return client;
};

export const tableClient = getTableClient();