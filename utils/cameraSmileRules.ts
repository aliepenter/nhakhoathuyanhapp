type FaceBounds =
  | {
      origin: { x: number; y: number };
      size: { width: number; height: number };
    }
  | {
      x: number;
      y: number;
      width: number;
      height: number;
    };

export type FaceLike = {
  bounds: FaceBounds;
  smilingProbability?: number;
  yawAngle?: number;
  rollAngle?: number;
};

export type GuideStatus = 'ready' | 'warning' | 'blocked';

export type FaceGuideResult = {
  ok: boolean;
  reason: string;
  status: GuideStatus;
  score: number;
};

export type FrameSize = {
  width: number;
  height: number;
};

type GuideEvalOptions = {
  isAndroid?: boolean;
};

export const GUIDE_TEXT = {
  noFace: 'Căn 1 khuôn mặt vào giữa vòng tròn',
  manyFaces: 'Chỉ để 1 khuôn mặt trong khung hình',
  lookStraight: 'Hãy nhìn thẳng vào camera',
  offCenter: 'Đưa mặt vào giữa vòng tròn',
  tooSmall: 'Tiến gần camera hơn một chút',
  tooLarge: 'Lùi xa camera một chút',
  notSmiling: 'Cười tươi hơn để chụp ảnh',
  good: 'Đạt điều kiện, bạn có thể chụp',
} as const;

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));

const toPercent = (value: number) => clamp(Math.round(value * 100));

const normalizeAngleTo180 = (angle: number) => {
  const wrapped = ((angle + 180) % 360 + 360) % 360 - 180;
  return wrapped;
};

const normalizeBounds = (bounds: FaceBounds) => {
  if ('origin' in bounds && 'size' in bounds) {
    return {
      x: bounds.origin.x,
      y: bounds.origin.y,
      width: bounds.size.width,
      height: bounds.size.height,
    };
  }

  return {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
  };
};

export function evaluateSmileGuide(
  faces: FaceLike[],
  frame: FrameSize,
  _isFrontCamera: boolean,
  options?: GuideEvalOptions
): FaceGuideResult {
  if (!faces || faces.length === 0) {
    return { ok: false, reason: GUIDE_TEXT.noFace, status: 'blocked', score: 0 };
  }

  if (faces.length > 1) {
    return { ok: false, reason: GUIDE_TEXT.manyFaces, status: 'blocked', score: 0 };
  }

  const face = faces[0];
  if (!face?.bounds || !frame.width || !frame.height) {
    return { ok: false, reason: GUIDE_TEXT.noFace, status: 'blocked', score: 0 };
  }

  const bounds = normalizeBounds(face.bounds);

  const faceCenterX = bounds.x + bounds.width / 2;
  const faceCenterY = bounds.y + bounds.height / 2;

  const targetCenterX = frame.width / 2;
  const targetCenterY = frame.height / 2;

  const centerDx = Math.abs(faceCenterX - targetCenterX) / frame.width;
  const centerDy = Math.abs(faceCenterY - targetCenterY) / frame.height;
  const isAndroid = !!options?.isAndroid;
  const maxCenterDx = isAndroid ? 0.16 : 0.12;
  const maxCenterDy = isAndroid ? 0.2 : 0.15;
  const centered = centerDx <= maxCenterDx && centerDy <= maxCenterDy;

  const faceWidthRatio = bounds.width / frame.width;
  const faceHeightRatio = bounds.height / frame.height;

  const minFaceWidthRatio = isAndroid ? 0.24 : 0.25;
  const minFaceHeightRatio = isAndroid ? 0.26 : 0.27;
  const maxFaceWidthRatio = isAndroid ? 0.74 : 0.72;
  const maxFaceHeightRatio = isAndroid ? 0.78 : 0.76;
  const maxYawAngle = isAndroid ? 26 : 16;
  const maxRollAngle = isAndroid ? 20 : 12;

  const sizeTooSmall = faceWidthRatio < minFaceWidthRatio || faceHeightRatio < minFaceHeightRatio;
  const sizeTooLarge = faceWidthRatio > maxFaceWidthRatio || faceHeightRatio > maxFaceHeightRatio;
  const yawAngle = Math.abs(
    normalizeAngleTo180(typeof face.yawAngle === 'number' ? face.yawAngle : 0)
  );
  const rollAngle = Math.abs(
    normalizeAngleTo180(typeof face.rollAngle === 'number' ? face.rollAngle : 0)
  );
  const lookingStraight = yawAngle <= maxYawAngle && rollAngle <= maxRollAngle;

  const smileProbability = typeof face.smilingProbability === 'number' ? face.smilingProbability : 0;
  const smiling = smileProbability >= (isAndroid ? 0.56 : 0.68);

  if (!lookingStraight) {
    return { ok: false, reason: GUIDE_TEXT.lookStraight, status: 'warning', score: 65 };
  }

  if (!centered) {
    return { ok: false, reason: GUIDE_TEXT.offCenter, status: 'warning', score: 45 };
  }

  if (sizeTooSmall) {
    return { ok: false, reason: GUIDE_TEXT.tooSmall, status: 'warning', score: 55 };
  }

  if (sizeTooLarge) {
    return { ok: false, reason: GUIDE_TEXT.tooLarge, status: 'warning', score: 55 };
  }

  if (!smiling) {
    return { ok: false, reason: GUIDE_TEXT.notSmiling, status: 'warning', score: 82 };
  }

  const centerScore = clamp(100 - toPercent((centerDx + centerDy) * 2));
  const smileScore = toPercent(smileProbability);
  const score = clamp(Math.round(centerScore * 0.45 + smileScore * 0.55));

  return { ok: true, reason: GUIDE_TEXT.good, status: 'ready', score };
}
