import { helper } from '@ember/component/helper';

const IMAGE_SERVER_URL = 'https://imageserver.eveonline.com';

export function eveAvatar([type, id, size]) {
  let suffix = 'png';
  let sizePx = size ? size : 256;

  if (type === 'character')
    suffix = 'jpg';

  return `${IMAGE_SERVER_URL}/${type.capitalize()}/${id}_${sizePx}.${suffix}`;
}

export default helper(eveAvatar);
