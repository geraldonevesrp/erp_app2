export const appVersion = {
    major: 1,    // Mudanças grandes/breaking changes
    minor: 1,    // Novas funcionalidades
    patch: 70,    // Correções de bugs e pequenas melhorias
    build: 1,    // Número do build (incrementado automaticamente)
};

export const getVersionString = () => {
    const { major, minor, patch, build } = appVersion;
    return `v${major}.${minor}.${patch.toString().padStart(3, '0')}`;
};
