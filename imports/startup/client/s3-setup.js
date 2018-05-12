Slingshot.fileRestrictions('uploadFlag', {
    allowedFileTypes: ['image/png', 'image/jpeg', 'image/svg+xml'],
    maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited)
})

Slingshot.fileRestrictions('uploadProfileHeader', {
    allowedFileTypes: ['image/png', 'image/jpeg', 'image/svg+xml'],
    maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited)
})

Slingshot.fileRestrictions('uploadProfileMap', {
    allowedFileTypes: ['image/png', 'image/jpeg', 'image/svg+xml'],
    maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited)
})