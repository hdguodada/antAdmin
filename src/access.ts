// src/access.ts
export default function access(initialState: { currentUser?: SYS.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
  };
}
