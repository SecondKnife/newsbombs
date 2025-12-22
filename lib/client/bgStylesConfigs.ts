// Background style configuration
export default async function bgStylesConfigs() {
  // Return a random flag number for background variety
  // You can customize this to return different values based on your needs
  const flagNumber = Math.floor(Math.random() * 5);
  
  return {
    flagNumber,
  };
}


