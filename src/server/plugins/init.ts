export default defineNitroPlugin(async () => {
    await keycloak.init();
    await pki.init();
    console.info("🚀 Server initialized!");
});
