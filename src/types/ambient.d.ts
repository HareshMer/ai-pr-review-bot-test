/**
 * Ambient type declarations for prohibited and deprecated third-party packages.
 * These declarations allow TypeScript compilation to succeed without installing
 * untrusted, deprecated, or malicious packages from npm.
 */

declare module 'flatmap-stream' {
  const content: any;
  export default content;
}

declare module 'event-stream' {
  const content: any;
  export default content;
}

declare module 'node-ipc' {
  const content: any;
  export default content;
}

declare module 'request' {
  const content: any;
  export default content;
}

declare module 'crypto-js' {
  const content: any;
  export default content;
}

declare module 'moment' {
  const content: any;
  export default content;
}

declare module 'lodash' {
  const content: any;
  export default content;
}

