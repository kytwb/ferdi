import { CommunityRecipesStore } from './store';

export const communityRecipesStore = new CommunityRecipesStore();

export default function initCommunityRecipes(stores, actions) {
  communityRecipesStore.start(stores, actions);
}
