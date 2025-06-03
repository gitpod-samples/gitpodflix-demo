import { createApp } from './app';

const port = process.env.PORT || 3001;
const app = createApp();

// Start server
app.listen(port, () => {
  console.log(`Catalog service running on port ${port}`);
});
