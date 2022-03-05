export const deleteAccount = async userId => {
  try {
    await auth().currentUser.delete();
    if (userId) await deleteUserData(userId);
  } catch (e) {
    console.log('not deleted', e);
  }
};
