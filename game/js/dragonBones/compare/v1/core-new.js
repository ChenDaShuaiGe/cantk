var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.Matrix
     * @classdesc
     * Matrix 类表示一个转换矩阵，它确定如何将点从一个坐标空间映射到另一个坐标空间。您可以对一个显示对象执行不同的图形转换，方法是设置 Matrix 对象的属性，将该 Matrix 对象应用于 Transform 对象的 matrix 属性，然后应用该 Transform 对象作为显示对象的 transform 属性。这些转换函数包括平移（x 和 y 重新定位）、旋转、缩放和倾斜。
     * 这些转换类型统称为仿射转换。仿射转换在转换时保持线条笔直，因此平行线保持平行。
     * 转换矩阵对象为具有如下内容的 3 x 3 的矩阵：
     *  a  c  tx
     *  b  d  ty
     *  u  v  w
     * 在传统的转换矩阵中，u、v 和 w 属性具有其他功能。Matrix 类只能在二维空间中操作，因此始终假定属性值 u 和 v 为 0.0，属性值 w 为 1.0。矩阵的有效值如下：
     *  a  c  tx
     *  b  d  ty
     *  0  0  1
     * 您可以获取和设置 Matrix 对象的全部六个其他属性的值：a、b、c、d、tx 和 ty。
     * Matrix 类支持四种主要类型的转换：平移、缩放、旋转和倾斜。您可以使用特定的方法来设置这些转换的其中三个，如下表中所述：
     * 转换	              矩阵值                      说明
     * 平移（置换）	                            将图像 tx 像素向右移动，将 ty 像素向下移动。
     *                   1  0  tx
     *                   0  1  ty
     *                   0  0  1
     * 缩放                                     将每个像素的位置乘以 x 轴的 sx 和 y 轴的 sy，从而调整图像的大小。
     *                   Sx  0  0
     *                   0  Sy  0
     *                   0  0   1
     * 旋转                                     将图像旋转一个以弧度为单位的角度 q。
     *                   cos(q)  -sin(q)  0
     *                   sin(q)  cos(q)   0
     *                   0         0      1
     * 倾斜或剪切                               以平行于 x 轴或 y 轴的方向逐渐滑动图像。Matrix 对象的 b 属性表示斜角沿 y 轴的正切；Matrix 对象的 c 属性表示斜角沿 x 轴的正切。
     *                  0        tan(skewX) 0
     *                  tan(skewY)  0       0
     *                   0          0       1
     * 每个转换函数都将更改当前矩阵的属性，所以您可以有效地合并多个转换。为此，请先调用多个转换函数，再将矩阵应用于其显示对象目标（通过使用该显示对象的 transform 属性）。
     */
    var Matrix = (function () {
        /**
         *构造函数，实例化一个Matrix，默认为是一个单位矩阵
         */
        function Matrix() {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.tx = 0;
            this.ty = 0;
        }
        /**
         *执行原始矩阵的逆转换。逆矩阵和单位矩阵相乘会得到的单位矩阵
         */
        Matrix.prototype.invert = function () {
            var a1 = this.a;
            var b1 = this.b;
            var c1 = this.c;
            var d1 = this.d;
            var tx1 = this.tx;
            var n = a1 * d1 - b1 * c1;
            this.a = d1 / n;
            this.b = -b1 / n;
            this.c = -c1 / n;
            this.d = a1 / n;
            this.tx = (c1 * this.ty - d1 * tx1) / n;
            this.ty = -(a1 * this.ty - b1 * tx1) / n;
        };
        /**
         *将某个矩阵与当前矩阵相乘，从而将这两个矩阵的几何效果有效地结合在一起。
         * 右乘，其几何意义是将两次几何变换变成一次
         * @param m
         */
        Matrix.prototype.concat = function (m) {
            var ma = m.a;
            var mb = m.b;
            var mc = m.c;
            var md = m.d;
            var tx1 = this.tx;
            var ty1 = this.ty;
            if (ma != 1 || mb != 0 || mc != 0 || md != 1) {
                var a1 = this.a;
                var b1 = this.b;
                var c1 = this.c;
                var d1 = this.d;
                this.a = a1 * ma + b1 * mc;
                this.b = a1 * mb + b1 * md;
                this.c = c1 * ma + d1 * mc;
                this.d = c1 * mb + d1 * md;
            }
            this.tx = tx1 * ma + ty1 * mc + m.tx;
            this.ty = tx1 * mb + ty1 * md + m.ty;
        };
        Matrix.prototype.copyFrom = function (m) {
            this.tx = m.tx;
            this.ty = m.ty;
            this.a = m.a;
            this.b = m.b;
            this.c = m.c;
            this.d = m.d;
        };
        return Matrix;
    })();
    dragonBones.Matrix = Matrix;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.ColorTransform
     * @classdesc
     * 表示颜色的transform
     */
    var ColorTransform = (function () {
        function ColorTransform() {
            this.alphaMultiplier = 1;
            this.alphaOffset = 0;
            this.blueMultiplier = 1;
            this.blueOffset = 0;
            this.greenMultiplier = 1;
            this.greenOffset = 0;
            this.redMultiplier = 1;
            this.redOffset = 0;
        }
        return ColorTransform;
    })();
    dragonBones.ColorTransform = ColorTransform;
})(dragonBones || (dragonBones = {}));

var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.TransformUtils
     * @classdesc
     * 提供了一些常用的转换的静态方法
     */
    var TransformUtil = (function () {
        function TransformUtil() {
        }
        /**
         * 全局坐标系转成成局部坐标系
         * @param transform 全局坐标系下的变换
         * @param parent 父亲的坐标变换
         */
        TransformUtil.globalToLocal = function (transform, parent) {
            TransformUtil.transformToMatrix(transform, TransformUtil._helpTransformMatrix, true);
            TransformUtil.transformToMatrix(parent, TransformUtil._helpParentTransformMatrix, true);
            TransformUtil._helpParentTransformMatrix.invert();
            TransformUtil._helpTransformMatrix.concat(TransformUtil._helpParentTransformMatrix);
            TransformUtil.matrixToTransform(TransformUtil._helpTransformMatrix, transform, transform.scaleX * parent.scaleX >= 0, transform.scaleY * parent.scaleY >= 0);
        };
        /**
         *把transform数据转成成矩阵数据
         * @param transform 需要转换的transform数据
         * @param matrix 转换后的矩阵数据
         * @param keepScale 是否保持缩放
         */
        TransformUtil.transformToMatrix = function (transform, matrix, keepScale) {
            if (keepScale === void 0) { keepScale = false; }
            if (keepScale) {
                matrix.a = transform.scaleX * dragonBones.MathUtil.cos(transform.skewY);
                matrix.b = transform.scaleX * dragonBones.MathUtil.sin(transform.skewY);
                matrix.c = -transform.scaleY * dragonBones.MathUtil.sin(transform.skewX);
                matrix.d = transform.scaleY * dragonBones.MathUtil.cos(transform.skewX);
                //                matrix.a = transform.scaleX * Math.cos(transform.skewY);
                //                matrix.b = transform.scaleX * Math.sin(transform.skewY);
                //                matrix.c = -transform.scaleY * Math.sin(transform.skewX);
                //                matrix.d = transform.scaleY * Math.cos(transform.skewX);
                matrix.tx = transform.x;
                matrix.ty = transform.y;
            }
            else {
                matrix.a = dragonBones.MathUtil.cos(transform.skewY);
                matrix.b = dragonBones.MathUtil.sin(transform.skewY);
                matrix.c = -dragonBones.MathUtil.sin(transform.skewX);
                matrix.d = dragonBones.MathUtil.cos(transform.skewX);
                //                matrix.a = Math.cos(transform.skewY);
                //                matrix.b = Math.sin(transform.skewY);
                //                matrix.c = -Math.sin(transform.skewX);
                //                matrix.d = Math.cos(transform.skewX);
                matrix.tx = transform.x;
                matrix.ty = transform.y;
            }
        };
        /**
         *把 矩阵数据转成成transform数据
         * @param matrix 需要转换的矩阵数据
         * @param transform 转换后的transform数据
         * @param scaleXF x方向的缩放
         * @param scaleYF y方向的缩放
         */
        TransformUtil.matrixToTransform = function (matrix, transform, scaleXF, scaleYF) {
            transform.x = matrix.tx;
            transform.y = matrix.ty;
            transform.scaleX = Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b) * (scaleXF ? 1 : -1);
            transform.scaleY = Math.sqrt(matrix.d * matrix.d + matrix.c * matrix.c) * (scaleYF ? 1 : -1);
            var skewXArray = [];
            skewXArray[0] = Math.acos(matrix.d / transform.scaleY);
            skewXArray[1] = -skewXArray[0];
            skewXArray[2] = Math.asin(-matrix.c / transform.scaleY);
            skewXArray[3] = skewXArray[2] >= 0 ? Math.PI - skewXArray[2] : skewXArray[2] - Math.PI;
            if (Number(skewXArray[0]).toFixed(4) == Number(skewXArray[2]).toFixed(4) || Number(skewXArray[0]).toFixed(4) == Number(skewXArray[3]).toFixed(4)) {
                transform.skewX = skewXArray[0];
            }
            else {
                transform.skewX = skewXArray[1];
            }
            var skewYArray = [];
            skewYArray[0] = Math.acos(matrix.a / transform.scaleX);
            skewYArray[1] = -skewYArray[0];
            skewYArray[2] = Math.asin(matrix.b / transform.scaleX);
            skewYArray[3] = skewYArray[2] >= 0 ? Math.PI - skewYArray[2] : skewYArray[2] - Math.PI;
            if (Number(skewYArray[0]).toFixed(4) == Number(skewYArray[2]).toFixed(4) || Number(skewYArray[0]).toFixed(4) == Number(skewYArray[3]).toFixed(4)) {
                transform.skewY = skewYArray[0];
            }
            else {
                transform.skewY = skewYArray[1];
            }
        };
        /**
         * 标准化弧度值，把弧度制换算到[-PI，PI]之间
         * @param radian 输入一个弧度值
         * @returns {number} 输出标准化后的弧度制
         */
        TransformUtil.formatRadian = function (radian) {
            //radian %= DOUBLE_PI;
            if (radian > Math.PI) {
                radian -= TransformUtil.DOUBLE_PI;
            }
            if (radian < -Math.PI) {
                radian += TransformUtil.DOUBLE_PI;
            }
            return radian;
        };
        /**
         *  确保角度在-180到180之间
         */
        TransformUtil.normalizeRotation = function (rotation) {
            rotation = (rotation + Math.PI) % (2 * Math.PI);
            rotation = rotation > 0 ? rotation : 2 * Math.PI + rotation;
            return rotation - Math.PI;
        };
        TransformUtil.HALF_PI = Math.PI * 0.5;
        TransformUtil.DOUBLE_PI = Math.PI * 2;
        TransformUtil._helpTransformMatrix = new dragonBones.Matrix();
        TransformUtil._helpParentTransformMatrix = new dragonBones.Matrix();
        return TransformUtil;
    })();
    dragonBones.TransformUtil = TransformUtil;
})(dragonBones || (dragonBones = {})); 

var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.MathUtil
     * @classdesc
     * 内部使用的有关数学计算的工具类
     */
    var MathUtil = (function () {
        function MathUtil() {
        }
        /** @private */
        MathUtil.getEaseValue = function (value, easing) {
            var valueEase = 1;
            if (easing > 1) {
                //valueEase = 0.5 * (1 - NumberUtils.cos(value * Math.PI));
                valueEase = 0.5 * (1 - MathUtil.cos(value * Math.PI));
                easing -= 1;
            }
            else if (easing > 0) {
                valueEase = 1 - Math.pow(1 - value, 2);
            }
            else if (easing < 0) {
                easing *= -1;
                valueEase = Math.pow(value, 2);
            }
            return (valueEase - value) * easing + value;
        };
        MathUtil.isNumber = function (value) {
            return typeof (value) === "number" && !isNaN(value);
        };
        /**
         * 得到对应角度值的sin近似值
         * @param value {number} 角度值
         * @returns {number} sin值
         */
        MathUtil.sin = function (value) {
            value *= MathUtil.RADIAN_TO_ANGLE;
            var valueFloor = Math.floor(value);
            var valueCeil = valueFloor + 1;
            var resultFloor = MathUtil.sinInt(valueFloor);
            var resultCeil = MathUtil.sinInt(valueCeil);
            return (value - valueFloor) * resultCeil + (valueCeil - value) * resultFloor;
        };
        MathUtil.sinInt = function (value) {
            value = value % 360;
            if (value < 0) {
                value += 360;
            }
            if (value < 90) {
                return db_sin_map[value];
            }
            if (value < 180) {
                return db_sin_map[180 - value];
            }
            if (value < 270) {
                return -db_sin_map[value - 180];
            }
            return -db_sin_map[360 - value];
        };
        /**
         * 得到对应角度值的cos近似值
         * @param value {number} 角度值
         * @returns {number} cos值
         */
        MathUtil.cos = function (value) {
            return MathUtil.sin(Math.PI / 2 - value);
        };
        /**
         * 角度转换为弧度
         */
        MathUtil.ANGLE_TO_RADIAN = Math.PI / 180;
        /**
         * 弧度转换为角度
         */
        MathUtil.RADIAN_TO_ANGLE = 180 / Math.PI;
        return MathUtil;
    })();
    dragonBones.MathUtil = MathUtil;
})(dragonBones || (dragonBones = {}));
var db_sin_map = {};
for (var dbMathIndex = 0; dbMathIndex <= 90; dbMathIndex++) {
    db_sin_map[dbMathIndex] = Math.sin(dbMathIndex * dragonBones.MathUtil.ANGLE_TO_RADIAN);
} 
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.DBDataUtil
     * @classdesc
     * DragonBons的数据工具类，提供一些对数据处理的静态方法
     */
    var DBDataUtil = (function () {
        function DBDataUtil() {
        }
        /**
         * 把ArmatureData的绝对数据转成成相对数据
         * @param armatureData
         */
        DBDataUtil.transformArmatureData = function (armatureData) {
            var boneDataList = armatureData.boneDataList;
            var i = boneDataList.length;
            while (i--) {
                var boneData = boneDataList[i];
                if (boneData.parent) {
                    var parentBoneData = armatureData.getBoneData(boneData.parent);
                    if (parentBoneData) {
                        boneData.transform.copy(boneData.global);
                        dragonBones.TransformUtil.globalToLocal(boneData.transform, parentBoneData.global);
                    }
                }
            }
        };
        /**
         * 转换骨架数据中的动画数据
         * 把动画数据中的绝对的数据转换成相对的数据
         * @param armatureData
         */
        DBDataUtil.transformArmatureDataAnimations = function (armatureData) {
            var animationDataList = armatureData.animationDataList;
            var i = animationDataList.length;
            while (i--) {
                DBDataUtil.transformAnimationData(animationDataList[i], armatureData, false);
            }
        };
        /**
         *
         * @param animationData
         * @param armatureData
         */
        DBDataUtil.transformRelativeAnimationData = function (animationData, armatureData) {
        };
        /**
         * 把动画数据中的绝对的数据转换成相对的数据
         * @param animationData 动画数据
         * @param armatureData 骨架数据
         * @param isGlobalData 是否是绝对数据
         */
        DBDataUtil.transformAnimationData = function (animationData, armatureData, isGlobalData) {
            if (!isGlobalData) {
                DBDataUtil.transformRelativeAnimationData(animationData, armatureData);
                return;
            }
            var skinData = armatureData.getSkinData(null);
            var boneDataList = armatureData.boneDataList;
            var slotDataList;
            if (skinData) {
                slotDataList = skinData.slotDataList;
            }
            for (var i = 0; i < boneDataList.length; i++) {
                var boneData = boneDataList[i];
                var timeline = animationData.getTimeline(boneData.name);
                var slotTimeline = animationData.getSlotTimeline(boneData.name);
                if (!timeline && !slotTimeline) {
                    continue;
                }
                var slotData = null;
                if (slotDataList) {
                    for (var j = 0, jLen = slotDataList.length; j < jLen; j++) {
                        slotData = slotDataList[j];
                        //找到属于当前Bone的slot(FLash Pro制作的动画一个Bone只包含一个slot)
                        if (slotData.parent == boneData.name) {
                            break;
                        }
                    }
                }
                var frameList = timeline.frameList;
                if (slotTimeline) {
                    var slotFrameList = slotTimeline.frameList;
                }
                var originTransform = null;
                var originPivot = null;
                var prevFrame = null;
                var frameListLength = frameList.length;
                for (var j = 0; j < frameListLength; j++) {
                    var frame = (frameList[j]);
                    //计算frame的transoform信息
                    DBDataUtil.setFrameTransform(animationData, armatureData, boneData, frame);
                    frame.transform.x -= boneData.transform.x;
                    frame.transform.y -= boneData.transform.y;
                    frame.transform.skewX -= boneData.transform.skewX;
                    frame.transform.skewY -= boneData.transform.skewY;
                    frame.transform.scaleX /= boneData.transform.scaleX;
                    frame.transform.scaleY /= boneData.transform.scaleY;
                    //如果originTransform不存在说明当前帧是第一帧，将当前帧的transform保存至timeline的originTransform
                    /*
                    if(!originTransform){
                        originTransform = timeline.originTransform;
                        originTransform.copy(frame.transform);
                        originTransform.skewX = TransformUtil.formatRadian(originTransform.skewX);
                        originTransform.skewY = TransformUtil.formatRadian(originTransform.skewY);
                        originPivot = timeline.originPivot;
                        originPivot.x = frame.pivot.x;
                        originPivot.y = frame.pivot.y;
                    }
                    
                    frame.transform.x -= originTransform.x;
                    frame.transform.y -= originTransform.y;
                    frame.transform.skewX = TransformUtil.formatRadian(frame.transform.skewX - originTransform.skewX);
                    frame.transform.skewY = TransformUtil.formatRadian(frame.transform.skewY - originTransform.skewY);
                    frame.transform.scaleX /= originTransform.scaleX;
                    frame.transform.scaleY /= originTransform.scaleY;
                    
                    if(!timeline.transformed){
                        frame.pivot.x -= originPivot.x;
                        frame.pivot.y -= originPivot.y;
                    }
                    */
                    if (prevFrame) {
                        var dLX = frame.transform.skewX - prevFrame.transform.skewX;
                        if (prevFrame.tweenRotate) {
                            if (prevFrame.tweenRotate > 0) {
                                if (dLX < 0) {
                                    frame.transform.skewX += Math.PI * 2;
                                    frame.transform.skewY += Math.PI * 2;
                                }
                                if (prevFrame.tweenRotate > 1) {
                                    frame.transform.skewX += Math.PI * 2 * (prevFrame.tweenRotate - 1);
                                    frame.transform.skewY += Math.PI * 2 * (prevFrame.tweenRotate - 1);
                                }
                            }
                            else {
                                if (dLX > 0) {
                                    frame.transform.skewX -= Math.PI * 2;
                                    frame.transform.skewY -= Math.PI * 2;
                                }
                                if (prevFrame.tweenRotate < 1) {
                                    frame.transform.skewX += Math.PI * 2 * (prevFrame.tweenRotate + 1);
                                    frame.transform.skewY += Math.PI * 2 * (prevFrame.tweenRotate + 1);
                                }
                            }
                        }
                        else {
                            frame.transform.skewX = prevFrame.transform.skewX + dragonBones.TransformUtil.formatRadian(frame.transform.skewX - prevFrame.transform.skewX);
                            frame.transform.skewY = prevFrame.transform.skewY + dragonBones.TransformUtil.formatRadian(frame.transform.skewY - prevFrame.transform.skewY);
                        }
                    }
                    prevFrame = frame;
                }
                if (slotTimeline && slotFrameList) {
                    frameListLength = slotFrameList.length;
                    for (var j = 0; j < frameListLength; j++) {
                        var slotFrame = slotFrameList[j];
                        if (!slotTimeline.transformed) {
                            if (slotData) {
                                slotFrame.zOrder -= slotData.zOrder;
                            }
                        }
                    }
                    slotTimeline.transformed = true;
                }
                timeline.transformed = true;
            }
        };
        //计算frame的transoform信息
        DBDataUtil.setFrameTransform = function (animationData, armatureData, boneData, frame) {
            frame.transform.copy(frame.global);
            //找到当前bone的父亲列表 并将timeline信息存入parentTimelineList 将boneData信息存入parentDataList
            var parentData = armatureData.getBoneData(boneData.parent);
            if (parentData) {
                var parentTimeline = animationData.getTimeline(parentData.name);
                if (parentTimeline) {
                    var parentTimelineList = [];
                    var parentDataList = [];
                    while (parentTimeline) {
                        parentTimelineList.push(parentTimeline);
                        parentDataList.push(parentData);
                        parentData = armatureData.getBoneData(parentData.parent);
                        if (parentData) {
                            parentTimeline = animationData.getTimeline(parentData.name);
                        }
                        else {
                            parentTimeline = null;
                        }
                    }
                    var i = parentTimelineList.length;
                    var globalTransform;
                    var globalTransformMatrix = new dragonBones.Matrix();
                    var currentTransform = new dragonBones.DBTransform();
                    var currentTransformMatrix = new dragonBones.Matrix();
                    //从根开始遍历
                    while (i--) {
                        parentTimeline = parentTimelineList[i];
                        parentData = parentDataList[i];
                        //一级一级找到当前帧对应的每个父节点的transform(相对transform)
                        DBDataUtil.getTimelineTransform(parentTimeline, frame.position, currentTransform, !globalTransform);
                        if (!globalTransform) {
                            globalTransform = new dragonBones.DBTransform();
                            globalTransform.copy(currentTransform);
                        }
                        else {
                            currentTransform.x += parentTimeline.originTransform.x + parentData.transform.x;
                            currentTransform.y += parentTimeline.originTransform.y + parentData.transform.y;
                            currentTransform.skewX += parentTimeline.originTransform.skewX + parentData.transform.skewX;
                            currentTransform.skewY += parentTimeline.originTransform.skewY + parentData.transform.skewY;
                            currentTransform.scaleX *= parentTimeline.originTransform.scaleX * parentData.transform.scaleX;
                            currentTransform.scaleY *= parentTimeline.originTransform.scaleY * parentData.transform.scaleY;
                            dragonBones.TransformUtil.transformToMatrix(currentTransform, currentTransformMatrix, true);
                            currentTransformMatrix.concat(globalTransformMatrix);
                            dragonBones.TransformUtil.matrixToTransform(currentTransformMatrix, globalTransform, currentTransform.scaleX * globalTransform.scaleX >= 0, currentTransform.scaleY * globalTransform.scaleY >= 0);
                        }
                        dragonBones.TransformUtil.transformToMatrix(globalTransform, globalTransformMatrix, true);
                    }
                    dragonBones.TransformUtil.globalToLocal(frame.transform, globalTransform);
                }
            }
        };
        DBDataUtil.getTimelineTransform = function (timeline, position, retult, isGlobal) {
            var frameList = timeline.frameList;
            var i = frameList.length;
            while (i--) {
                var currentFrame = (frameList[i]);
                //找到穿越当前帧的关键帧
                if (currentFrame.position <= position && currentFrame.position + currentFrame.duration > position) {
                    //是最后一帧或者就是当前帧
                    if (i == frameList.length - 1 || position == currentFrame.position) {
                        retult.copy(isGlobal ? currentFrame.global : currentFrame.transform);
                    }
                    else {
                        var tweenEasing = currentFrame.tweenEasing;
                        var progress = (position - currentFrame.position) / currentFrame.duration;
                        if (tweenEasing && tweenEasing != 10) {
                            progress = dragonBones.MathUtil.getEaseValue(progress, tweenEasing);
                        }
                        var nextFrame = frameList[i + 1];
                        var currentTransform = isGlobal ? currentFrame.global : currentFrame.transform;
                        var nextTransform = isGlobal ? nextFrame.global : nextFrame.transform;
                        retult.x = currentTransform.x + (nextTransform.x - currentTransform.x) * progress;
                        retult.y = currentTransform.y + (nextTransform.y - currentTransform.y) * progress;
                        retult.skewX = dragonBones.TransformUtil.formatRadian(currentTransform.skewX + (nextTransform.skewX - currentTransform.skewX) * progress);
                        retult.skewY = dragonBones.TransformUtil.formatRadian(currentTransform.skewY + (nextTransform.skewY - currentTransform.skewY) * progress);
                        retult.scaleX = currentTransform.scaleX + (nextTransform.scaleX - currentTransform.scaleX) * progress;
                        retult.scaleY = currentTransform.scaleY + (nextTransform.scaleY - currentTransform.scaleY) * progress;
                    }
                    break;
                }
            }
        };
        /**
         * 添加进隐藏的时间轴
         * @param animationData
         * @param armatureData
         */
        DBDataUtil.addHideTimeline = function (animationData, armatureData, addHideSlot) {
            if (addHideSlot === void 0) { addHideSlot = false; }
            var boneDataList = armatureData.boneDataList;
            var slotDataList = armatureData.slotDataList;
            var i = boneDataList.length;
            while (i--) {
                var boneData = boneDataList[i];
                var boneName = boneData.name;
                if (!animationData.getTimeline(boneName)) {
                    if (animationData.hideTimelineNameMap.indexOf(boneName) < 0) {
                        animationData.hideTimelineNameMap.push(boneName);
                    }
                }
            }
            if (addHideSlot) {
                i = slotDataList.length;
                var slotData;
                var slotName;
                while (i--) {
                    slotData = slotDataList[i];
                    slotName = slotData.name;
                    if (!animationData.getSlotTimeline(slotName)) {
                        if (animationData.hideSlotTimelineNameMap.indexOf(slotName) < 0) {
                            animationData.hideSlotTimelineNameMap.push(slotName);
                        }
                    }
                }
            }
        };
        return DBDataUtil;
    })();
    dragonBones.DBDataUtil = DBDataUtil;
})(dragonBones || (dragonBones = {})); 

var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.ConstValues
     * @classdesc
     *定义了常用的常量
     */
    var ConstValues = (function () {
        function ConstValues() {
        }
        /**
         * 角度转换为弧度
         */
        ConstValues.ANGLE_TO_RADIAN = Math.PI / 180;
        /**
         * 弧度转换为角度
         */
        ConstValues.RADIAN_TO_ANGLE = 180 / Math.PI;
        /**
         *龙骨
         */
        ConstValues.DRAGON_BONES = "dragonBones";
        /**
         * 骨架
         */
        ConstValues.ARMATURE = "armature";
        /**
         *皮肤
         */
        ConstValues.SKIN = "skin";
        /**
         * 骨骼
         */
        ConstValues.BONE = "bone";
        /**
         * 插槽
         */
        ConstValues.SLOT = "slot";
        /**
         * 显示对象
         */
        ConstValues.DISPLAY = "display";
        /**
         * 动画
         */
        ConstValues.ANIMATION = "animation";
        /**
         * 时间轴
         */
        ConstValues.TIMELINE = "timeline";
        /**
         * 帧
         */
        ConstValues.FRAME = "frame";
        /**
         * 变换
         */
        ConstValues.TRANSFORM = "transform";
        /**
         * 颜色变换
         */
        ConstValues.COLOR_TRANSFORM = "colorTransform";
        ConstValues.COLOR = "color";
        /**
         * 矩形
         */
        ConstValues.RECTANGLE = "rectangle";
        /**
         * 椭圆
         */
        ConstValues.ELLIPSE = "ellipse";
        /**
         * 纹理集
         */
        ConstValues.TEXTURE_ATLAS = "TextureAtlas";
        /**
         * 子纹理
         */
        ConstValues.SUB_TEXTURE = "SubTexture";
        /**
         * 旋转
         */
        ConstValues.A_ROTATED = "rotated";
        /**
         * 帧的x坐标
         */
        ConstValues.A_FRAME_X = "frameX";
        /**
         * 帧的y坐标
         */
        ConstValues.A_FRAME_Y = "frameY";
        /**
         * 帧的宽度
         */
        ConstValues.A_FRAME_WIDTH = "frameWidth";
        /**
         * 帧的高度
         */
        ConstValues.A_FRAME_HEIGHT = "frameHeight";
        /**
         * 版本
         */
        ConstValues.A_VERSION = "version";
        /**
         * 图片路径
         */
        ConstValues.A_IMAGE_PATH = "imagePath";
        /**
         * 帧速率
         */
        ConstValues.A_FRAME_RATE = "frameRate";
        /**
         * 名字
         */
        ConstValues.A_NAME = "name";
        /**
         * 是否是全局
         */
        ConstValues.A_IS_GLOBAL = "isGlobal";
        /**
         * 父亲
         */
        ConstValues.A_PARENT = "parent";
        /**
         * 长度
         */
        ConstValues.A_LENGTH = "length";
        /**
         * 类型
         */
        ConstValues.A_TYPE = "type";
        /**
         * 缓入事件
         */
        ConstValues.A_FADE_IN_TIME = "fadeInTime";
        /**
         * 持续时长
         */
        ConstValues.A_DURATION = "duration";
        /**
         * 缩放
         */
        ConstValues.A_SCALE = "scale";
        /**
         * 偏移
         */
        ConstValues.A_OFFSET = "offset";
        /**
         * 循环
         */
        ConstValues.A_LOOP = "loop";
        ConstValues.A_PLAY_TIMES = "playTimes";
        /**
         * 事件
         */
        ConstValues.A_EVENT = "event";
        /**
         * 事件参数
         */
        ConstValues.A_EVENT_PARAMETERS = "eventParameters";
        /**
         * 声音
         */
        ConstValues.A_SOUND = "sound";
        /**
         * 动作
         */
        ConstValues.A_ACTION = "action";
        /**
         * 隐藏
         */
        ConstValues.A_HIDE = "hide";
        /**
         * 自动补间
         */
        ConstValues.A_AUTO_TWEEN = "autoTween";
        /**
         * 补间缓动
         */
        ConstValues.A_TWEEN_EASING = "tweenEasing";
        /**
         * 补间旋转
         */
        ConstValues.A_TWEEN_ROTATE = "tweenRotate";
        /**
         * 补间缩放
         */
        ConstValues.A_TWEEN_SCALE = "tweenScale";
        /**
         * 显示对象序号
         */
        ConstValues.A_DISPLAY_INDEX = "displayIndex";
        /**
         * z轴
         */
        ConstValues.A_Z_ORDER = "z";
        /**
         * 混合模式
         */
        ConstValues.A_BLENDMODE = "blendMode";
        /**
         * 宽度
         */
        ConstValues.A_WIDTH = "width";
        /**
         * 高度
         */
        ConstValues.A_HEIGHT = "height";
        /**
         * 继承缩放
         */
        ConstValues.A_INHERIT_SCALE = "inheritScale";
        /**
         * 继承旋转
         */
        ConstValues.A_INHERIT_ROTATION = "inheritRotation";
        /**
         * x轴
         */
        ConstValues.A_X = "x";
        /**
         * y轴
         */
        ConstValues.A_Y = "y";
        /**
         * x方向斜切
         */
        ConstValues.A_SKEW_X = "skX";
        /**
         * y方向斜切
         */
        ConstValues.A_SKEW_Y = "skY";
        /**
         * x方向缩放
         */
        ConstValues.A_SCALE_X = "scX";
        /**
         * y方向缩放
         */
        ConstValues.A_SCALE_Y = "scY";
        /**
         * 轴点的x坐标
         */
        ConstValues.A_PIVOT_X = "pX";
        /**
         * 轴点的y坐标
         */
        ConstValues.A_PIVOT_Y = "pY";
        /**
         * 透明度的偏移
         */
        ConstValues.A_ALPHA_OFFSET = "aO";
        /**
         * 红色的偏移
         */
        ConstValues.A_RED_OFFSET = "rO";
        /**
         * 绿色的偏移
         */
        ConstValues.A_GREEN_OFFSET = "gO";
        /**
         * 蓝色的偏移
         */
        ConstValues.A_BLUE_OFFSET = "bO";
        /**
         * 透明度的倍数
         */
        ConstValues.A_ALPHA_MULTIPLIER = "aM";
        /**
         * 红色的倍数
         */
        ConstValues.A_RED_MULTIPLIER = "rM";
        /**
         * 绿色的倍数
         */
        ConstValues.A_GREEN_MULTIPLIER = "gM";
        /**
         * 蓝色的倍数
         */
        ConstValues.A_BLUE_MULTIPLIER = "bM";
        /**
         * 动画曲线
         */
        ConstValues.A_CURVE = "curve";
        /**
         * x方向缩放的偏移
         */
        ConstValues.A_SCALE_X_OFFSET = "scXOffset";
        /**
         * y方向的偏移
         */
        ConstValues.A_SCALE_Y_OFFSET = "scYOffset";
        /**
         * 缩放模式
         */
        ConstValues.A_SCALE_MODE = "scaleMode";
        /**
         * 旋转修正
         */
        ConstValues.A_FIXED_ROTATION = "fixedRotation";
        return ConstValues;
    })();
    dragonBones.ConstValues = ConstValues;
})(dragonBones || (dragonBones = {})); 
var dragonBones;
(function (dragonBones) {
    var ColorTransformUtil = (function () {
        function ColorTransformUtil() {
        }
        ColorTransformUtil.cloneColor = function (color) {
            var c = new dragonBones.ColorTransform();
            c.redMultiplier = color.redMultiplier;
            c.greenMultiplier = color.greenMultiplier;
            c.blueMultiplier = color.blueMultiplier;
            c.alphaMultiplier = color.alphaMultiplier;
            c.redOffset = color.redOffset;
            c.greenOffset = color.greenOffset;
            c.blueOffset = color.blueOffset;
            c.alphaOffset = color.alphaOffset;
            return c;
        };
        ColorTransformUtil.isEqual = function (color1, color2) {
            return color1.alphaOffset == color2.alphaOffset &&
                color1.redOffset == color2.redOffset &&
                color1.greenOffset == color2.greenOffset &&
                color1.blueOffset == color2.blueOffset &&
                color1.alphaMultiplier == color2.alphaMultiplier &&
                color1.redMultiplier == color2.redMultiplier &&
                color1.greenMultiplier == color2.greenMultiplier &&
                color1.blueMultiplier == color2.blueMultiplier;
        };
        ColorTransformUtil.minus = function (color1, color2, outputColor) {
            outputColor.alphaOffset = color1.alphaOffset - color2.alphaOffset;
            outputColor.redOffset = color1.redOffset - color2.redOffset;
            outputColor.greenOffset = color1.greenOffset - color2.greenOffset;
            outputColor.blueOffset = color1.blueOffset - color2.blueOffset;
            outputColor.alphaMultiplier = color1.alphaMultiplier - color2.alphaMultiplier;
            outputColor.redMultiplier = color1.redMultiplier - color2.redMultiplier;
            outputColor.greenMultiplier = color1.greenMultiplier - color2.greenMultiplier;
            outputColor.blueMultiplier = color1.blueMultiplier - color2.blueMultiplier;
        };
        ColorTransformUtil.originalColor = new dragonBones.ColorTransform();
        return ColorTransformUtil;
    })();
    dragonBones.ColorTransformUtil = ColorTransformUtil;
})(dragonBones || (dragonBones = {})); 
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.TextureData
     * @classdesc
     * 纹理数据
     *
     * @example
     * <pre>
     *   //获取动画数据
     *   var skeletonData = RES.getRes("skeleton");
     *   //获取纹理集数据
     *   var textureData = RES.getRes("textureConfig");
     *   //获取纹理集图片
     *   var texture = RES.getRes("texture");
     *
     *   //创建一个工厂，用来创建Armature
     *   var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
     *   //把动画数据添加到工厂里
     *   factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
     *   //把纹理集数据和图片添加到工厂里
     *   factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
     *   //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
     *   var armatureName:string = skeletonData.armature[0].name;
     *   //从工厂里创建出Armature
     *   var armature:dragonBones.Armature = factory.buildArmature(armatureName);
     *   //获取装载Armature的容器
     *   var armatureDisplay = armature.display;
     *   //把它添加到舞台上
     *   this.addChild(armatureDisplay);
     *   //取得这个Armature动画列表中的第一个动画的名字
     *   var curAnimationName = armature.animation.animationList[0];
     *   //播放这个动画，gotoAndPlay参数说明,具体详见Animation类
     *   //第一个参数 animationName {string} 指定播放动画的名称.
     *   //第二个参数 fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
     *   //第三个参数 duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
     *   //第四个参数 layTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
     *   armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);
     *
     *   //把Armature添加到心跳时钟里
     *   dragonBones.WorldClock.clock.add(armature);
     *   //心跳时钟开启
     *   egret.Ticker.getInstance().register(function (advancedTime) {
     *       dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
     *   }, this);
     * </pre>
     */
    var TextureData = (function () {
        /**
         *创建一个 TextureData 实例
         * @param region 区域
         * @param frame 帧的区域
         * @param rotated
         */
        function TextureData(region, frame, rotated) {
            this.region = region;
            this.frame = frame;
            this.rotated = rotated;
        }
        return TextureData;
    })();
    dragonBones.TextureData = TextureData;
})(dragonBones || (dragonBones = {})); 
var dragonBones;
(function (dragonBones) {
    /**
     *@class dragonBones.DataParser
     * @classdesc
     * 数据解析
     *
     * @example
       <pre>
         //获取动画数据
         var skeletonData = RES.getRes("skeleton");
         //获取纹理集数据
         var textureData = RES.getRes("textureConfig");
         //获取纹理集图片
         var texture = RES.getRes("texture");
      
         //创建一个工厂，用来创建Armature
         var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
         //把动画数据添加到工厂里
         factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
         //把纹理集数据和图片添加到工厂里
         factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
         //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
         var armatureName:string = skeletonData.armature[0].name;
         //从工厂里创建出Armature
         var armature:dragonBones.Armature = factory.buildArmature(armatureName);
         //获取装载Armature的容器
         var armatureDisplay = armature.display;
         //把它添加到舞台上
         this.addChild(armatureDisplay);
         //取得这个Armature动画列表中的第一个动画的名字
         var curAnimationName = armature.animation.animationList[0];
         //播放这个动画，gotoAndPlay参数说明,具体详见Animation类
         //第一个参数 animationName {string} 指定播放动画的名称.
         //第二个参数 fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
         //第三个参数 duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
         //第四个参数 layTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
         armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);
      
         //把Armature添加到心跳时钟里
         dragonBones.WorldClock.clock.add(armature);
         //心跳时钟开启
         egret.Ticker.getInstance().register(function (advancedTime) {
             dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
         }, this);
       </pre>
     */
    var DataParser = (function () {
        function DataParser() {
        }
        /**
         *解析纹理集数据
         * @param rawData纹理集数据xml或者json
         * @param scale纹理资源的缩放，默认为1，不缩放
         * @returns {any}返回纹理集数据，存放TexutrueData的字典类型
         */
        DataParser.parseTextureAtlasData = function (rawData, scale) {
            if (scale === void 0) { scale = 1; }
            var textureAtlasData = {};
            var subTextureFrame;
            var subTextureList = rawData[dragonBones.ConstValues.SUB_TEXTURE];
            for (var key in subTextureList) {
                var subTextureObject = subTextureList[key];
                var subTextureName = subTextureObject[dragonBones.ConstValues.A_NAME];
                var subTextureRegion = new dragonBones.Rectangle();
                subTextureRegion.x = DataParser.getNumber(subTextureObject, dragonBones.ConstValues.A_X, 0) / scale;
                subTextureRegion.y = DataParser.getNumber(subTextureObject, dragonBones.ConstValues.A_Y, 0) / scale;
                subTextureRegion.width = DataParser.getNumber(subTextureObject, dragonBones.ConstValues.A_WIDTH, 0) / scale;
                subTextureRegion.height = DataParser.getNumber(subTextureObject, dragonBones.ConstValues.A_HEIGHT, 0) / scale;
                var rotated = subTextureObject[dragonBones.ConstValues.A_ROTATED] == "true";
                var frameWidth = DataParser.getNumber(subTextureObject, dragonBones.ConstValues.A_FRAME_WIDTH, 0) / scale;
                var frameHeight = DataParser.getNumber(subTextureObject, dragonBones.ConstValues.A_FRAME_HEIGHT, 0) / scale;
                if (frameWidth > 0 && frameHeight > 0) {
                    subTextureFrame = new dragonBones.Rectangle();
                    subTextureFrame.x = DataParser.getNumber(subTextureObject, dragonBones.ConstValues.A_FRAME_X, 0) / scale;
                    subTextureFrame.y = DataParser.getNumber(subTextureObject, dragonBones.ConstValues.A_FRAME_Y, 0) / scale;
                    subTextureFrame.width = frameWidth;
                    subTextureFrame.height = frameHeight;
                }
                else {
                    subTextureFrame = null;
                }
                textureAtlasData[subTextureName] = new dragonBones.TextureData(subTextureRegion, subTextureFrame, rotated);
            }
            return textureAtlasData;
        };
        /**
         * 解析DragonBones的数据，xml或者json，该数据包含了骨骼，皮肤，动画的数据
         * @param rawDataToParse DragonBones的数据，xml或者json格式
         * @returns {DragonBonesData} 返回DragonBones引擎使用的数据格式
         */
        DataParser.parseDragonBonesData = function (rawDataToParse) {
            if (!rawDataToParse) {
                throw new Error();
            }
            var version = rawDataToParse[dragonBones.ConstValues.A_VERSION];
            version = version.toString();
            if (version.toString() != dragonBones.DragonBones.DATA_VERSION &&
                version.toString() != dragonBones.DragonBones.PARENT_COORDINATE_DATA_VERSION &&
                version.toString() != "2.3") {
                throw new Error(egret.getString(4003));
            }
            else if (version.toString() == dragonBones.DragonBones.PARENT_COORDINATE_DATA_VERSION ||
                version.toString() == "2.3") {
                return dragonBones.Data3Parser.parseDragonBonesData(rawDataToParse);
            }
            var frameRate = DataParser.getNumber(rawDataToParse, dragonBones.ConstValues.A_FRAME_RATE, 0) || 0;
            var outputDragonBonesData = new dragonBones.DragonBonesData();
            outputDragonBonesData.name = rawDataToParse[dragonBones.ConstValues.A_NAME];
            outputDragonBonesData.isGlobal = rawDataToParse[dragonBones.ConstValues.A_IS_GLOBAL] == "0" ? false : true;
            DataParser.tempDragonBonesData = outputDragonBonesData;
            var armatureList = rawDataToParse[dragonBones.ConstValues.ARMATURE];
            for (var key in armatureList) {
                var armatureObject = rawDataToParse[dragonBones.ConstValues.ARMATURE][key];
                outputDragonBonesData.addArmatureData(DataParser.parseArmatureData(armatureObject, frameRate));
            }
            DataParser.tempDragonBonesData = null;
            return outputDragonBonesData;
        };
        DataParser.parseArmatureData = function (armatureDataToParse, frameRate) {
            var outputArmatureData = new dragonBones.ArmatureData();
            outputArmatureData.name = armatureDataToParse[dragonBones.ConstValues.A_NAME];
            var boneList = armatureDataToParse[dragonBones.ConstValues.BONE];
            for (var key in boneList) {
                var boneObject = boneList[key];
                outputArmatureData.addBoneData(DataParser.parseBoneData(boneObject));
            }
            var slotList = armatureDataToParse[dragonBones.ConstValues.SLOT];
            for (var key in slotList) {
                var slotObject = slotList[key];
                outputArmatureData.addSlotData(DataParser.parseSlotData(slotObject));
            }
            var skinList = armatureDataToParse[dragonBones.ConstValues.SKIN];
            for (var key in skinList) {
                var skinObject = skinList[key];
                outputArmatureData.addSkinData(DataParser.parseSkinData(skinObject));
            }
            if (DataParser.tempDragonBonesData.isGlobal) {
                dragonBones.DBDataUtil.transformArmatureData(outputArmatureData);
            }
            outputArmatureData.sortBoneDataList();
            var animationList = armatureDataToParse[dragonBones.ConstValues.ANIMATION];
            for (var key in animationList) {
                var animationObject = animationList[key];
                var animationData = DataParser.parseAnimationData(animationObject, frameRate);
                dragonBones.DBDataUtil.addHideTimeline(animationData, outputArmatureData, true);
                dragonBones.DBDataUtil.transformAnimationData(animationData, outputArmatureData, DataParser.tempDragonBonesData.isGlobal);
                outputArmatureData.addAnimationData(animationData);
            }
            return outputArmatureData;
        };
        //把bone的初始transform解析并返回
        DataParser.parseBoneData = function (boneObject) {
            var boneData = new dragonBones.BoneData();
            boneData.name = boneObject[dragonBones.ConstValues.A_NAME];
            boneData.parent = boneObject[dragonBones.ConstValues.A_PARENT];
            boneData.length = Number(boneObject[dragonBones.ConstValues.A_LENGTH]) || 0;
            boneData.inheritRotation = DataParser.getBoolean(boneObject, dragonBones.ConstValues.A_INHERIT_ROTATION, true);
            boneData.inheritScale = DataParser.getBoolean(boneObject, dragonBones.ConstValues.A_INHERIT_SCALE, true);
            DataParser.parseTransform(boneObject[dragonBones.ConstValues.TRANSFORM], boneData.transform);
            if (DataParser.tempDragonBonesData.isGlobal) {
                boneData.global.copy(boneData.transform);
            }
            return boneData;
        };
        DataParser.parseSkinData = function (skinObject) {
            var skinData = new dragonBones.SkinData();
            skinData.name = skinObject[dragonBones.ConstValues.A_NAME];
            var slotList = skinObject[dragonBones.ConstValues.SLOT];
            for (var key in slotList) {
                var slotObject = slotList[key];
                skinData.addSlotData(DataParser.parseSlotDisplayData(slotObject));
            }
            return skinData;
        };
        DataParser.parseSlotData = function (slotObject) {
            var slotData = new dragonBones.SlotData();
            slotData.name = slotObject[dragonBones.ConstValues.A_NAME];
            slotData.parent = slotObject[dragonBones.ConstValues.A_PARENT];
            slotData.zOrder = DataParser.getNumber(slotObject, dragonBones.ConstValues.A_Z_ORDER, 0) || 0;
            slotData.displayIndex = DataParser.getNumber(slotObject, dragonBones.ConstValues.A_DISPLAY_INDEX, 0);
            slotData.blendMode = slotObject[dragonBones.ConstValues.A_BLENDMODE];
            return slotData;
        };
        DataParser.parseSlotDisplayData = function (slotObject) {
            var slotData = new dragonBones.SlotData();
            slotData.name = slotObject[dragonBones.ConstValues.A_NAME];
            slotData.parent = slotObject[dragonBones.ConstValues.A_PARENT];
            slotData.zOrder = DataParser.getNumber(slotObject, dragonBones.ConstValues.A_Z_ORDER, 0) || 0;
            var displayList = slotObject[dragonBones.ConstValues.DISPLAY];
            for (var key in displayList) {
                var displayObject = displayList[key];
                slotData.addDisplayData(DataParser.parseDisplayData(displayObject));
            }
            return slotData;
        };
        DataParser.parseDisplayData = function (displayObject) {
            var displayData = new dragonBones.DisplayData();
            displayData.name = displayObject[dragonBones.ConstValues.A_NAME];
            displayData.type = displayObject[dragonBones.ConstValues.A_TYPE];
            DataParser.parseTransform(displayObject[dragonBones.ConstValues.TRANSFORM], displayData.transform, displayData.pivot);
            displayData.pivot.x = NaN;
            displayData.pivot.y = NaN;
            if (DataParser.tempDragonBonesData != null) {
                DataParser.tempDragonBonesData.addDisplayData(displayData);
            }
            return displayData;
        };
        /** @private */
        DataParser.parseAnimationData = function (animationObject, frameRate) {
            var animationData = new dragonBones.AnimationData();
            animationData.name = animationObject[dragonBones.ConstValues.A_NAME];
            animationData.frameRate = frameRate;
            animationData.duration = Math.round((DataParser.getNumber(animationObject, dragonBones.ConstValues.A_DURATION, 1) || 1) * 1000 / frameRate);
            animationData.playTimes = DataParser.getNumber(animationObject, dragonBones.ConstValues.A_PLAY_TIMES, 1);
            animationData.playTimes = animationData.playTimes != NaN ? animationData.playTimes : 1;
            animationData.fadeTime = DataParser.getNumber(animationObject, dragonBones.ConstValues.A_FADE_IN_TIME, 0) || 0;
            animationData.scale = DataParser.getNumber(animationObject, dragonBones.ConstValues.A_SCALE, 1) || 0;
            //use frame tweenEase, NaN
            //overwrite frame tweenEase, [-1, 0):ease in, 0:line easing, (0, 1]:ease out, (1, 2]:ease in out
            animationData.tweenEasing = DataParser.getNumber(animationObject, dragonBones.ConstValues.A_TWEEN_EASING, NaN);
            animationData.autoTween = DataParser.getBoolean(animationObject, dragonBones.ConstValues.A_AUTO_TWEEN, true);
            var frameObjectList = animationObject[dragonBones.ConstValues.FRAME];
            var i = 0;
            var len = 0;
            if (frameObjectList) {
                for (i = 0, len = frameObjectList.length; i < len; i++) {
                    var frameObject = frameObjectList[i];
                    var frame = DataParser.parseTransformFrame(frameObject, frameRate);
                    animationData.addFrame(frame);
                }
            }
            DataParser.parseTimeline(animationObject, animationData);
            var lastFrameDuration = animationData.duration;
            var timelineObjectList = animationObject[dragonBones.ConstValues.BONE];
            if (timelineObjectList) {
                for (i = 0, len = timelineObjectList.length; i < len; i++) {
                    var timelineObject = timelineObjectList[i];
                    if (timelineObject) {
                        var timeline = DataParser.parseTransformTimeline(timelineObject, animationData.duration, frameRate);
                        if (timeline.frameList.length > 0) {
                            lastFrameDuration = Math.min(lastFrameDuration, timeline.frameList[timeline.frameList.length - 1].duration);
                        }
                        animationData.addTimeline(timeline);
                    }
                }
            }
            var slotTimelineObjectList = animationObject[dragonBones.ConstValues.SLOT];
            if (slotTimelineObjectList) {
                for (i = 0, len = slotTimelineObjectList.length; i < len; i++) {
                    var slotTimelineObject = slotTimelineObjectList[i];
                    if (slotTimelineObject) {
                        var slotTimeline = DataParser.parseSlotTimeline(slotTimelineObject, animationData.duration, frameRate);
                        if (slotTimeline.frameList.length > 0) {
                            lastFrameDuration = Math.min(lastFrameDuration, slotTimeline.frameList[slotTimeline.frameList.length - 1].duration);
                            animationData.addSlotTimeline(slotTimeline);
                        }
                    }
                }
            }
            if (animationData.frameList.length > 0) {
                lastFrameDuration = Math.min(lastFrameDuration, animationData.frameList[animationData.frameList.length - 1].duration);
            }
            //取得timeline中最小的lastFrameDuration并保存
            animationData.lastFrameDuration = lastFrameDuration;
            return animationData;
        };
        DataParser.parseTransformTimeline = function (timelineObject, duration, frameRate) {
            var outputTimeline = new dragonBones.TransformTimeline();
            outputTimeline.name = timelineObject[dragonBones.ConstValues.A_NAME];
            outputTimeline.scale = DataParser.getNumber(timelineObject, dragonBones.ConstValues.A_SCALE, 1) || 0;
            outputTimeline.offset = DataParser.getNumber(timelineObject, dragonBones.ConstValues.A_OFFSET, 0) || 0;
            outputTimeline.originPivot.x = DataParser.getNumber(timelineObject, dragonBones.ConstValues.A_PIVOT_X, 0) || 0;
            outputTimeline.originPivot.y = DataParser.getNumber(timelineObject, dragonBones.ConstValues.A_PIVOT_Y, 0) || 0;
            outputTimeline.duration = duration;
            var frameList = timelineObject[dragonBones.ConstValues.FRAME];
            for (var key in frameList) {
                var frameObject = frameList[key];
                var frame = DataParser.parseTransformFrame(frameObject, frameRate);
                outputTimeline.addFrame(frame);
            }
            DataParser.parseTimeline(timelineObject, outputTimeline);
            return outputTimeline;
        };
        DataParser.parseSlotTimeline = function (timelineObject, duration, frameRate) {
            var outputTimeline = new dragonBones.SlotTimeline();
            outputTimeline.name = timelineObject[dragonBones.ConstValues.A_NAME];
            outputTimeline.scale = DataParser.getNumber(timelineObject, dragonBones.ConstValues.A_SCALE, 1) || 0;
            outputTimeline.offset = DataParser.getNumber(timelineObject, dragonBones.ConstValues.A_OFFSET, 0) || 0;
            outputTimeline.duration = duration;
            var frameList = timelineObject[dragonBones.ConstValues.FRAME];
            for (var key in frameList) {
                var frameObject = frameList[key];
                var frame = DataParser.parseSlotFrame(frameObject, frameRate);
                outputTimeline.addFrame(frame);
            }
            DataParser.parseTimeline(timelineObject, outputTimeline);
            return outputTimeline;
        };
        DataParser.parseTransformFrame = function (frameObject, frameRate) {
            var outputFrame = new dragonBones.TransformFrame();
            DataParser.parseFrame(frameObject, outputFrame, frameRate);
            outputFrame.visible = !DataParser.getBoolean(frameObject, dragonBones.ConstValues.A_HIDE, false);
            //NaN:no tween, 10:auto tween, [-1, 0):ease in, 0:line easing, (0, 1]:ease out, (1, 2]:ease in out
            outputFrame.tweenEasing = DataParser.getNumber(frameObject, dragonBones.ConstValues.A_TWEEN_EASING, 10);
            outputFrame.tweenRotate = Math.floor(DataParser.getNumber(frameObject, dragonBones.ConstValues.A_TWEEN_ROTATE, 0) || 0);
            outputFrame.tweenScale = DataParser.getBoolean(frameObject, dragonBones.ConstValues.A_TWEEN_SCALE, true);
            outputFrame.displayIndex = Math.floor(DataParser.getNumber(frameObject, dragonBones.ConstValues.A_DISPLAY_INDEX, 0) || 0);
            DataParser.parseTransform(frameObject[dragonBones.ConstValues.TRANSFORM], outputFrame.transform, outputFrame.pivot);
            if (DataParser.tempDragonBonesData.isGlobal) {
                outputFrame.global.copy(outputFrame.transform);
            }
            outputFrame.scaleOffset.x = DataParser.getNumber(frameObject, dragonBones.ConstValues.A_SCALE_X_OFFSET, 0) || 0;
            outputFrame.scaleOffset.y = DataParser.getNumber(frameObject, dragonBones.ConstValues.A_SCALE_Y_OFFSET, 0) || 0;
            return outputFrame;
        };
        DataParser.parseSlotFrame = function (frameObject, frameRate) {
            var outputFrame = new dragonBones.SlotFrame();
            DataParser.parseFrame(frameObject, outputFrame, frameRate);
            outputFrame.visible = !DataParser.getBoolean(frameObject, dragonBones.ConstValues.A_HIDE, false);
            //NaN:no tween, 10:auto tween, [-1, 0):ease in, 0:line easing, (0, 1]:ease out, (1, 2]:ease in out
            outputFrame.tweenEasing = DataParser.getNumber(frameObject, dragonBones.ConstValues.A_TWEEN_EASING, 10);
            outputFrame.displayIndex = Math.floor(DataParser.getNumber(frameObject, dragonBones.ConstValues.A_DISPLAY_INDEX, 0) || 0);
            //如果为NaN，则说明没有改变过zOrder
            outputFrame.zOrder = DataParser.getNumber(frameObject, dragonBones.ConstValues.A_Z_ORDER, DataParser.tempDragonBonesData.isGlobal ? NaN : 0);
            var colorTransformObject = frameObject[dragonBones.ConstValues.COLOR];
            if (colorTransformObject) {
                outputFrame.color = new dragonBones.ColorTransform();
                DataParser.parseColorTransform(colorTransformObject, outputFrame.color);
            }
            return outputFrame;
        };
        DataParser.parseTimeline = function (timelineObject, outputTimeline) {
            var position = 0;
            var frame;
            var frameList = outputTimeline.frameList;
            for (var key in frameList) {
                frame = frameList[key];
                frame.position = position;
                position += frame.duration;
            }
            //防止duration计算有误差
            if (frame) {
                frame.duration = outputTimeline.duration - frame.position;
            }
        };
        DataParser.parseFrame = function (frameObject, outputFrame, frameRate) {
            if (frameRate === void 0) { frameRate = 0; }
            outputFrame.duration = Math.round(((frameObject[dragonBones.ConstValues.A_DURATION]) || 1) * 1000 / frameRate);
            outputFrame.action = frameObject[dragonBones.ConstValues.A_ACTION];
            outputFrame.event = frameObject[dragonBones.ConstValues.A_EVENT];
            outputFrame.sound = frameObject[dragonBones.ConstValues.A_SOUND];
            var curve = frameObject[dragonBones.ConstValues.A_CURVE];
            if (curve != null && curve.length == 4) {
                outputFrame.curve = new dragonBones.CurveData();
                outputFrame.curve.pointList = [new dragonBones.Point(curve[0], curve[1]),
                    new dragonBones.Point(curve[2], curve[3])];
            }
        };
        DataParser.parseTransform = function (transformObject, transform, pivot) {
            if (pivot === void 0) { pivot = null; }
            if (transformObject) {
                if (transform) {
                    transform.x = DataParser.getNumber(transformObject, dragonBones.ConstValues.A_X, 0) || 0;
                    transform.y = DataParser.getNumber(transformObject, dragonBones.ConstValues.A_Y, 0) || 0;
                    transform.skewX = DataParser.getNumber(transformObject, dragonBones.ConstValues.A_SKEW_X, 0) * dragonBones.ConstValues.ANGLE_TO_RADIAN || 0;
                    transform.skewY = DataParser.getNumber(transformObject, dragonBones.ConstValues.A_SKEW_Y, 0) * dragonBones.ConstValues.ANGLE_TO_RADIAN || 0;
                    transform.scaleX = DataParser.getNumber(transformObject, dragonBones.ConstValues.A_SCALE_X, 1) || 0;
                    transform.scaleY = DataParser.getNumber(transformObject, dragonBones.ConstValues.A_SCALE_Y, 1) || 0;
                }
                if (pivot) {
                    pivot.x = DataParser.getNumber(transformObject, dragonBones.ConstValues.A_PIVOT_X, 0) || 0;
                    pivot.y = DataParser.getNumber(transformObject, dragonBones.ConstValues.A_PIVOT_Y, 0) || 0;
                }
            }
        };
        DataParser.parseColorTransform = function (colorTransformObject, colorTransform) {
            if (colorTransform) {
                colorTransform.alphaOffset = DataParser.getNumber(colorTransformObject, dragonBones.ConstValues.A_ALPHA_OFFSET, 0);
                colorTransform.redOffset = DataParser.getNumber(colorTransformObject, dragonBones.ConstValues.A_RED_OFFSET, 0);
                colorTransform.greenOffset = DataParser.getNumber(colorTransformObject, dragonBones.ConstValues.A_GREEN_OFFSET, 0);
                colorTransform.blueOffset = DataParser.getNumber(colorTransformObject, dragonBones.ConstValues.A_BLUE_OFFSET, 0);
                colorTransform.alphaMultiplier = DataParser.getNumber(colorTransformObject, dragonBones.ConstValues.A_ALPHA_MULTIPLIER, 100) * 0.01;
                colorTransform.redMultiplier = DataParser.getNumber(colorTransformObject, dragonBones.ConstValues.A_RED_MULTIPLIER, 100) * 0.01;
                colorTransform.greenMultiplier = DataParser.getNumber(colorTransformObject, dragonBones.ConstValues.A_GREEN_MULTIPLIER, 100) * 0.01;
                colorTransform.blueMultiplier = DataParser.getNumber(colorTransformObject, dragonBones.ConstValues.A_BLUE_MULTIPLIER, 100) * 0.01;
            }
        };
        DataParser.getBoolean = function (data, key, defaultValue) {
            if (data && key in data) {
                switch (String(data[key])) {
                    case "0":
                    case "NaN":
                    case "":
                    case "false":
                    case "null":
                    case "undefined":
                        return false;
                    case "1":
                    case "true":
                    default:
                        return true;
                }
            }
            return defaultValue;
        };
        DataParser.getNumber = function (data, key, defaultValue) {
            if (data && key in data) {
                switch (String(data[key])) {
                    case "NaN":
                    case "":
                    case "false":
                    case "null":
                    case "undefined":
                        return NaN;
                    default:
                        return Number(data[key]);
                }
            }
            return defaultValue;
        };
        return DataParser;
    })();
    dragonBones.DataParser = DataParser;
})(dragonBones || (dragonBones = {})); 
var dragonBones;
(function (dragonBones) {
    /**
     *@class dragonBones.DataParser
     * @classdesc
     * 老版本数据解析
     */
    var Data3Parser = (function () {
        function Data3Parser() {
        }
        Data3Parser.parseDragonBonesData = function (rawDataToParse) {
            if (!rawDataToParse) {
                throw new Error();
            }
            var version = rawDataToParse[dragonBones.ConstValues.A_VERSION];
            version = version.toString();
            if (version.toString() != dragonBones.DragonBones.DATA_VERSION &&
                version.toString() != dragonBones.DragonBones.PARENT_COORDINATE_DATA_VERSION &&
                version.toString() != "2.3") {
                throw new Error("Nonsupport version!");
            }
            var frameRate = Data3Parser.getNumber(rawDataToParse, dragonBones.ConstValues.A_FRAME_RATE, 0) || 0;
            var outputDragonBonesData = new dragonBones.DragonBonesData();
            outputDragonBonesData.name = rawDataToParse[dragonBones.ConstValues.A_NAME];
            outputDragonBonesData.isGlobal = rawDataToParse[dragonBones.ConstValues.A_IS_GLOBAL] == "0" ? false : true;
            Data3Parser.tempDragonBonesData = outputDragonBonesData;
            var armatureList = rawDataToParse[dragonBones.ConstValues.ARMATURE];
            for (var key in armatureList) {
                var armatureObject = rawDataToParse[dragonBones.ConstValues.ARMATURE][key];
                outputDragonBonesData.addArmatureData(Data3Parser.parseArmatureData(armatureObject, frameRate));
            }
            Data3Parser.tempDragonBonesData = null;
            return outputDragonBonesData;
        };
        Data3Parser.parseArmatureData = function (armatureDataToParse, frameRate) {
            var outputArmatureData = new dragonBones.ArmatureData();
            outputArmatureData.name = armatureDataToParse[dragonBones.ConstValues.A_NAME];
            var boneList = armatureDataToParse[dragonBones.ConstValues.BONE];
            for (var key in boneList) {
                var boneObject = boneList[key];
                outputArmatureData.addBoneData(Data3Parser.parseBoneData(boneObject));
            }
            var skinList = armatureDataToParse[dragonBones.ConstValues.SKIN];
            for (var skinKey in skinList) {
                var skinSlotList = skinList[skinKey];
                var skinSlotObject = skinSlotList[dragonBones.ConstValues.SLOT];
                for (var slotKey in skinSlotObject) {
                    var slotObject = skinSlotObject[slotKey];
                    outputArmatureData.addSlotData(Data3Parser.parseSlotData(slotObject));
                }
            }
            for (var key in skinList) {
                var skinObject = skinList[key];
                outputArmatureData.addSkinData(Data3Parser.parseSkinData(skinObject));
            }
            if (Data3Parser.tempDragonBonesData.isGlobal) {
                dragonBones.DBDataUtil.transformArmatureData(outputArmatureData);
            }
            outputArmatureData.sortBoneDataList();
            var animationList = armatureDataToParse[dragonBones.ConstValues.ANIMATION];
            for (var key in animationList) {
                var animationObject = animationList[key];
                var animationData = Data3Parser.parseAnimationData(animationObject, frameRate);
                dragonBones.DBDataUtil.addHideTimeline(animationData, outputArmatureData);
                dragonBones.DBDataUtil.transformAnimationData(animationData, outputArmatureData, Data3Parser.tempDragonBonesData.isGlobal);
                outputArmatureData.addAnimationData(animationData);
            }
            return outputArmatureData;
        };
        //把bone的初始transform解析并返回
        Data3Parser.parseBoneData = function (boneObject) {
            var boneData = new dragonBones.BoneData();
            boneData.name = boneObject[dragonBones.ConstValues.A_NAME];
            boneData.parent = boneObject[dragonBones.ConstValues.A_PARENT];
            boneData.length = Number(boneObject[dragonBones.ConstValues.A_LENGTH]) || 0;
            boneData.inheritRotation = Data3Parser.getBoolean(boneObject, dragonBones.ConstValues.A_INHERIT_ROTATION, true);
            boneData.inheritScale = Data3Parser.getBoolean(boneObject, dragonBones.ConstValues.A_INHERIT_SCALE, true);
            Data3Parser.parseTransform(boneObject[dragonBones.ConstValues.TRANSFORM], boneData.transform);
            if (Data3Parser.tempDragonBonesData.isGlobal) {
                boneData.global.copy(boneData.transform);
            }
            return boneData;
        };
        Data3Parser.parseSkinData = function (skinObject) {
            var skinData = new dragonBones.SkinData();
            skinData.name = skinObject[dragonBones.ConstValues.A_NAME];
            var slotList = skinObject[dragonBones.ConstValues.SLOT];
            for (var key in slotList) {
                var slotObject = slotList[key];
                skinData.addSlotData(Data3Parser.parseSkinSlotData(slotObject));
            }
            return skinData;
        };
        Data3Parser.parseSkinSlotData = function (slotObject) {
            var slotData = new dragonBones.SlotData();
            slotData.name = slotObject[dragonBones.ConstValues.A_NAME];
            slotData.parent = slotObject[dragonBones.ConstValues.A_PARENT];
            slotData.zOrder = (slotObject[dragonBones.ConstValues.A_Z_ORDER]);
            slotData.zOrder = Data3Parser.getNumber(slotObject, dragonBones.ConstValues.A_Z_ORDER, 0) || 0;
            slotData.blendMode = slotObject[dragonBones.ConstValues.A_BLENDMODE];
            var displayList = slotObject[dragonBones.ConstValues.DISPLAY];
            for (var key in displayList) {
                var displayObject = displayList[key];
                slotData.addDisplayData(Data3Parser.parseDisplayData(displayObject));
            }
            return slotData;
        };
        Data3Parser.parseSlotData = function (slotObject) {
            var slotData = new dragonBones.SlotData();
            slotData.name = slotObject[dragonBones.ConstValues.A_NAME];
            slotData.parent = slotObject[dragonBones.ConstValues.A_PARENT];
            slotData.zOrder = (slotObject[dragonBones.ConstValues.A_Z_ORDER]);
            slotData.zOrder = Data3Parser.getNumber(slotObject, dragonBones.ConstValues.A_Z_ORDER, 0) || 0;
            slotData.blendMode = slotObject[dragonBones.ConstValues.A_BLENDMODE];
            slotData.displayIndex = 0;
            return slotData;
        };
        Data3Parser.parseDisplayData = function (displayObject) {
            var displayData = new dragonBones.DisplayData();
            displayData.name = displayObject[dragonBones.ConstValues.A_NAME];
            displayData.type = displayObject[dragonBones.ConstValues.A_TYPE];
            Data3Parser.parseTransform(displayObject[dragonBones.ConstValues.TRANSFORM], displayData.transform, displayData.pivot);
            if (Data3Parser.tempDragonBonesData != null) {
                Data3Parser.tempDragonBonesData.addDisplayData(displayData);
            }
            return displayData;
        };
        /** @private */
        Data3Parser.parseAnimationData = function (animationObject, frameRate) {
            var animationData = new dragonBones.AnimationData();
            animationData.name = animationObject[dragonBones.ConstValues.A_NAME];
            animationData.frameRate = frameRate;
            animationData.duration = Math.round((Data3Parser.getNumber(animationObject, dragonBones.ConstValues.A_DURATION, 1) || 1) * 1000 / frameRate);
            animationData.playTimes = Data3Parser.getNumber(animationObject, dragonBones.ConstValues.A_LOOP, 1);
            animationData.playTimes = animationData.playTimes != NaN ? animationData.playTimes : 1;
            animationData.fadeTime = Data3Parser.getNumber(animationObject, dragonBones.ConstValues.A_FADE_IN_TIME, 0) || 0;
            animationData.scale = Data3Parser.getNumber(animationObject, dragonBones.ConstValues.A_SCALE, 1) || 0;
            //use frame tweenEase, NaN
            //overwrite frame tweenEase, [-1, 0):ease in, 0:line easing, (0, 1]:ease out, (1, 2]:ease in out
            animationData.tweenEasing = Data3Parser.getNumber(animationObject, dragonBones.ConstValues.A_TWEEN_EASING, NaN);
            animationData.autoTween = Data3Parser.getBoolean(animationObject, dragonBones.ConstValues.A_AUTO_TWEEN, true);
            var frameObjectList = animationObject[dragonBones.ConstValues.FRAME];
            var i = 0;
            var len = 0;
            if (frameObjectList) {
                for (i = 0, len = frameObjectList.length; i < len; i++) {
                    var frameObject = frameObjectList[i];
                    var frame = Data3Parser.parseTransformFrame(frameObject, frameRate);
                    animationData.addFrame(frame);
                }
            }
            Data3Parser.parseTimeline(animationObject, animationData);
            var lastFrameDuration = animationData.duration;
            var displayIndexChangeSlotTimelines = [];
            var displayIndexChangeTimelines = [];
            var timelineObjectList = animationObject[dragonBones.ConstValues.TIMELINE];
            if (timelineObjectList) {
                for (i = 0, len = timelineObjectList.length; i < len; i++) {
                    var timelineObject = timelineObjectList[i];
                    var timeline = Data3Parser.parseTransformTimeline(timelineObject, animationData.duration, frameRate);
                    timeline = Data3Parser.parseTransformTimeline(timelineObject, animationData.duration, frameRate);
                    lastFrameDuration = Math.min(lastFrameDuration, timeline.frameList[timeline.frameList.length - 1].duration);
                    animationData.addTimeline(timeline);
                    var slotTimeline = Data3Parser.parseSlotTimeline(timelineObject, animationData.duration, frameRate);
                    animationData.addSlotTimeline(slotTimeline);
                    if (animationData.autoTween) {
                        var displayIndexChange;
                        var slotFrame;
                        for (var j = 0, jlen = slotTimeline.frameList.length; j < jlen; j++) {
                            slotFrame = slotTimeline.frameList[j];
                            if (slotFrame && slotFrame.displayIndex < 0) {
                                displayIndexChange = true;
                                break;
                            }
                        }
                        if (displayIndexChange) {
                            displayIndexChangeTimelines.push(timeline);
                            displayIndexChangeSlotTimelines.push(slotTimeline);
                        }
                    }
                }
                len = displayIndexChangeSlotTimelines.length;
                var animationTween = animationData.tweenEasing;
                if (len > 0) {
                    for (i = 0; i < len; i++) {
                        slotTimeline = displayIndexChangeSlotTimelines[i];
                        timeline = displayIndexChangeTimelines[i];
                        var curFrame;
                        var curSlotFrame;
                        var nextSlotFrame;
                        for (j = 0, jlen = slotTimeline.frameList.length; j < jlen; j++) {
                            curSlotFrame = slotTimeline.frameList[j];
                            curFrame = timeline.frameList[j];
                            nextSlotFrame = (j == jlen - 1) ? slotTimeline.frameList[0] : slotTimeline.frameList[j + 1];
                            if (curSlotFrame.displayIndex < 0 || nextSlotFrame.displayIndex < 0) {
                                curFrame.tweenEasing = curSlotFrame.tweenEasing = NaN;
                            }
                            else if (animationTween == 10) {
                                curFrame.tweenEasing = curSlotFrame.tweenEasing = 0;
                            }
                            else if (!isNaN(animationTween)) {
                                curFrame.tweenEasing = curSlotFrame.tweenEasing = animationTween;
                            }
                            else if (curFrame.tweenEasing == 10) {
                                curFrame.tweenEasing = 0;
                            }
                        }
                    }
                    animationData.autoTween = false;
                }
            }
            if (animationData.frameList.length > 0) {
                lastFrameDuration = Math.min(lastFrameDuration, animationData.frameList[animationData.frameList.length - 1].duration);
            }
            //取得timeline中最小的lastFrameDuration并保存
            animationData.lastFrameDuration = lastFrameDuration;
            return animationData;
        };
        Data3Parser.parseSlotTimeline = function (timelineObject, duration, frameRate) {
            var outputTimeline = new dragonBones.SlotTimeline();
            outputTimeline.name = timelineObject[dragonBones.ConstValues.A_NAME];
            outputTimeline.scale = Data3Parser.getNumber(timelineObject, dragonBones.ConstValues.A_SCALE, 1) || 0;
            outputTimeline.offset = Data3Parser.getNumber(timelineObject, dragonBones.ConstValues.A_OFFSET, 0) || 0;
            outputTimeline.duration = duration;
            var frameList = timelineObject[dragonBones.ConstValues.FRAME];
            for (var key in frameList) {
                var frameObject = frameList[key];
                var frame = Data3Parser.parseSlotFrame(frameObject, frameRate);
                outputTimeline.addFrame(frame);
            }
            Data3Parser.parseTimeline(timelineObject, outputTimeline);
            return outputTimeline;
        };
        Data3Parser.parseSlotFrame = function (frameObject, frameRate) {
            var outputFrame = new dragonBones.SlotFrame();
            Data3Parser.parseFrame(frameObject, outputFrame, frameRate);
            outputFrame.visible = !Data3Parser.getBoolean(frameObject, dragonBones.ConstValues.A_HIDE, false);
            //NaN:no tween, 10:auto tween, [-1, 0):ease in, 0:line easing, (0, 1]:ease out, (1, 2]:ease in out
            outputFrame.tweenEasing = Data3Parser.getNumber(frameObject, dragonBones.ConstValues.A_TWEEN_EASING, 10);
            outputFrame.displayIndex = Math.floor(Data3Parser.getNumber(frameObject, dragonBones.ConstValues.A_DISPLAY_INDEX, 0) || 0);
            //如果为NaN，则说明没有改变过zOrder
            outputFrame.zOrder = Data3Parser.getNumber(frameObject, dragonBones.ConstValues.A_Z_ORDER, Data3Parser.tempDragonBonesData.isGlobal ? NaN : 0);
            var colorTransformObject = frameObject[dragonBones.ConstValues.COLOR_TRANSFORM];
            if (colorTransformObject) {
                outputFrame.color = new dragonBones.ColorTransform();
                Data3Parser.parseColorTransform(colorTransformObject, outputFrame.color);
            }
            return outputFrame;
        };
        Data3Parser.parseTransformTimeline = function (timelineObject, duration, frameRate) {
            var outputTimeline = new dragonBones.TransformTimeline();
            outputTimeline.name = timelineObject[dragonBones.ConstValues.A_NAME];
            outputTimeline.scale = Data3Parser.getNumber(timelineObject, dragonBones.ConstValues.A_SCALE, 1) || 0;
            outputTimeline.offset = Data3Parser.getNumber(timelineObject, dragonBones.ConstValues.A_OFFSET, 0) || 0;
            outputTimeline.originPivot.x = Data3Parser.getNumber(timelineObject, dragonBones.ConstValues.A_PIVOT_X, 0) || 0;
            outputTimeline.originPivot.y = Data3Parser.getNumber(timelineObject, dragonBones.ConstValues.A_PIVOT_Y, 0) || 0;
            outputTimeline.duration = duration;
            var frameList = timelineObject[dragonBones.ConstValues.FRAME];
            for (var key in frameList) {
                var frameObject = frameList[key];
                var frame = Data3Parser.parseTransformFrame(frameObject, frameRate);
                outputTimeline.addFrame(frame);
            }
            Data3Parser.parseTimeline(timelineObject, outputTimeline);
            return outputTimeline;
        };
        Data3Parser.parseTransformFrame = function (frameObject, frameRate) {
            var outputFrame = new dragonBones.TransformFrame();
            Data3Parser.parseFrame(frameObject, outputFrame, frameRate);
            outputFrame.visible = !Data3Parser.getBoolean(frameObject, dragonBones.ConstValues.A_HIDE, false);
            //NaN:no tween, 10:auto tween, [-1, 0):ease in, 0:line easing, (0, 1]:ease out, (1, 2]:ease in out
            outputFrame.tweenEasing = Data3Parser.getNumber(frameObject, dragonBones.ConstValues.A_TWEEN_EASING, 10);
            outputFrame.tweenRotate = Math.floor(Data3Parser.getNumber(frameObject, dragonBones.ConstValues.A_TWEEN_ROTATE, 0) || 0);
            outputFrame.tweenScale = Data3Parser.getBoolean(frameObject, dragonBones.ConstValues.A_TWEEN_SCALE, true);
            //outputFrame.displayIndex = Math.floor(Data3Parser.getNumber(frameObject, ConstValues.A_DISPLAY_INDEX, 0)|| 0);
            Data3Parser.parseTransform(frameObject[dragonBones.ConstValues.TRANSFORM], outputFrame.transform, outputFrame.pivot);
            if (Data3Parser.tempDragonBonesData.isGlobal) {
                outputFrame.global.copy(outputFrame.transform);
            }
            outputFrame.scaleOffset.x = Data3Parser.getNumber(frameObject, dragonBones.ConstValues.A_SCALE_X_OFFSET, 0) || 0;
            outputFrame.scaleOffset.y = Data3Parser.getNumber(frameObject, dragonBones.ConstValues.A_SCALE_Y_OFFSET, 0) || 0;
            return outputFrame;
        };
        Data3Parser.parseTimeline = function (timelineObject, outputTimeline) {
            var position = 0;
            var frame;
            var frameList = outputTimeline.frameList;
            for (var key in frameList) {
                frame = frameList[key];
                frame.position = position;
                position += frame.duration;
            }
            //防止duration计算有误差
            if (frame) {
                frame.duration = outputTimeline.duration - frame.position;
            }
        };
        Data3Parser.parseFrame = function (frameObject, outputFrame, frameRate) {
            if (frameRate === void 0) { frameRate = 0; }
            outputFrame.duration = Math.round(((frameObject[dragonBones.ConstValues.A_DURATION]) || 1) * 1000 / frameRate);
            outputFrame.action = frameObject[dragonBones.ConstValues.A_ACTION];
            outputFrame.event = frameObject[dragonBones.ConstValues.A_EVENT];
            outputFrame.sound = frameObject[dragonBones.ConstValues.A_SOUND];
        };
        Data3Parser.parseTransform = function (transformObject, transform, pivot) {
            if (pivot === void 0) { pivot = null; }
            if (transformObject) {
                if (transform) {
                    transform.x = Data3Parser.getNumber(transformObject, dragonBones.ConstValues.A_X, 0) || 0;
                    transform.y = Data3Parser.getNumber(transformObject, dragonBones.ConstValues.A_Y, 0) || 0;
                    transform.skewX = Data3Parser.getNumber(transformObject, dragonBones.ConstValues.A_SKEW_X, 0) * dragonBones.ConstValues.ANGLE_TO_RADIAN || 0;
                    transform.skewY = Data3Parser.getNumber(transformObject, dragonBones.ConstValues.A_SKEW_Y, 0) * dragonBones.ConstValues.ANGLE_TO_RADIAN || 0;
                    transform.scaleX = Data3Parser.getNumber(transformObject, dragonBones.ConstValues.A_SCALE_X, 1) || 0;
                    transform.scaleY = Data3Parser.getNumber(transformObject, dragonBones.ConstValues.A_SCALE_Y, 1) || 0;
                }
                if (pivot) {
                    pivot.x = Data3Parser.getNumber(transformObject, dragonBones.ConstValues.A_PIVOT_X, 0) || 0;
                    pivot.y = Data3Parser.getNumber(transformObject, dragonBones.ConstValues.A_PIVOT_Y, 0) || 0;
                }
            }
        };
        Data3Parser.parseColorTransform = function (colorTransformObject, colorTransform) {
            if (colorTransformObject) {
                if (colorTransform) {
                    colorTransform.alphaOffset = Data3Parser.getNumber(colorTransformObject, dragonBones.ConstValues.A_ALPHA_OFFSET, 0);
                    colorTransform.redOffset = Data3Parser.getNumber(colorTransformObject, dragonBones.ConstValues.A_RED_OFFSET, 0);
                    colorTransform.greenOffset = Data3Parser.getNumber(colorTransformObject, dragonBones.ConstValues.A_GREEN_OFFSET, 0);
                    colorTransform.blueOffset = Data3Parser.getNumber(colorTransformObject, dragonBones.ConstValues.A_BLUE_OFFSET, 0);
                    colorTransform.alphaMultiplier = Data3Parser.getNumber(colorTransformObject, dragonBones.ConstValues.A_ALPHA_MULTIPLIER, 100) * 0.01;
                    colorTransform.redMultiplier = Data3Parser.getNumber(colorTransformObject, dragonBones.ConstValues.A_RED_MULTIPLIER, 100) * 0.01;
                    colorTransform.greenMultiplier = Data3Parser.getNumber(colorTransformObject, dragonBones.ConstValues.A_GREEN_MULTIPLIER, 100) * 0.01;
                    colorTransform.blueMultiplier = Data3Parser.getNumber(colorTransformObject, dragonBones.ConstValues.A_BLUE_MULTIPLIER, 100) * 0.01;
                }
            }
        };
        Data3Parser.getBoolean = function (data, key, defaultValue) {
            if (data && key in data) {
                switch (String(data[key])) {
                    case "0":
                    case "NaN":
                    case "":
                    case "false":
                    case "null":
                    case "undefined":
                        return false;
                    case "1":
                    case "true":
                    default:
                        return true;
                }
            }
            return defaultValue;
        };
        Data3Parser.getNumber = function (data, key, defaultValue) {
            if (data && key in data) {
                switch (String(data[key])) {
                    case "NaN":
                    case "":
                    case "false":
                    case "null":
                    case "undefined":
                        return NaN;
                    default:
                        return Number(data[key]);
                }
            }
            return defaultValue;
        };
        return Data3Parser;
    })();
    dragonBones.Data3Parser = Data3Parser;
})(dragonBones || (dragonBones = {})); 
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.Timeline
     * @classdesc
     * 保存时间轴相关的数据，包括关键帧，持续时间，时间缩放
     */
    var Timeline = (function () {
        /**
         * 初始化数据duration为0，scale为1
         */
        function Timeline() {
            /**
             * 持续时间，单位是帧
             * @member {number} dragonBones.Timeline#duration
             */
            this.duration = 0;
            this._frameList = [];
            this.duration = 0;
            this.scale = 1;
        }
        Timeline.prototype.dispose = function () {
            var i = this._frameList.length;
            while (i--) {
                this._frameList[i].dispose();
            }
            this._frameList = null;
        };
        /**
         * 添加一个关键帧数据
         * @param frame 关键帧数据
         * @see extension.dragonbones.model.Frame
         */
        Timeline.prototype.addFrame = function (frame) {
            if (!frame) {
                throw new Error();
            }
            if (this._frameList.indexOf(frame) < 0) {
                this._frameList[this._frameList.length] = frame;
            }
            else {
                throw new Error();
            }
        };
        Object.defineProperty(Timeline.prototype, "frameList", {
            /**
             * 获取关键帧列表
             * @returns {Array<Frame>}
             */
            get: function () {
                return this._frameList;
            },
            enumerable: true,
            configurable: true
        });
        return Timeline;
    })();
    dragonBones.Timeline = Timeline;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////

var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.TransformTimeline
     * @extends dragonBones.Timeline
     * @classdesc
     * 骨骼的时间轴数据，包含一个和多个关键帧数据
     */
    var TransformTimeline = (function (_super) {
        __extends(TransformTimeline, _super);
        /**
         * 构造函数，实例化一个TransformTimeline
         */
        function TransformTimeline() {
            _super.call(this);
            this.originTransform = new dragonBones.DBTransform();
            this.originTransform.scaleX = 1;
            this.originTransform.scaleY = 1;
            this.originPivot = new dragonBones.Point();
            this.offset = 0;
        }
        /**
         * 释放资源
         */
        TransformTimeline.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.originTransform = null;
            this.originPivot = null;
        };
        return TransformTimeline;
    })(dragonBones.Timeline);
    dragonBones.TransformTimeline = TransformTimeline;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.Frame
     * @classdesc
     *关键帧数据
     */
    var Frame = (function () {
        /**
         *构造函数
         */
        function Frame() {
            /**
             *位置
             * @member {number} dragonBones.Frame#position
             */
            this.position = 0;
            /**
             *持续时间
             * @member {number} dragonBones.Frame#duration
             */
            this.duration = 0;
            this.position = 0;
            this.duration = 0;
        }
        /**
         *释放资源
         */
        Frame.prototype.dispose = function () {
        };
        return Frame;
    })();
    dragonBones.Frame = Frame;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////

var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.TransformFrame
     * @extends dragonBones.Frame
     * @classdesc
     * 骨骼的关键帧数据，包含骨骼的缓动，旋转，transform数据和
     * 插槽的显示序号，可见度，zOrder，colorTransform数据
     */
    var TransformFrame = (function (_super) {
        __extends(TransformFrame, _super);
        /**
         *构造函数，实例化一个TransformFrame
         */
        function TransformFrame() {
            _super.call(this);
            /**
             * 旋转几圈
             * @member {number} dragonBones.TransformFrame#tweenRotate
             */
            this.tweenRotate = 0;
            /**
             *绑定到该骨骼的插槽的显示序号，当插槽有多个显示对象时，指定显示哪一个显示对象
             * @member {number} dragonBones.TransformFrame#displayIndex
             */
            this.displayIndex = 0;
            this.tweenEasing = 10;
            this.tweenRotate = 0;
            this.tweenScale = true;
            this.displayIndex = 0;
            this.visible = true;
            this.zOrder = NaN;
            this.global = new dragonBones.DBTransform();
            this.transform = new dragonBones.DBTransform();
            this.pivot = new dragonBones.Point();
            this.scaleOffset = new dragonBones.Point();
        }
        /**
         *释放资源
         */
        TransformFrame.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.global = null;
            this.transform = null;
            this.pivot = null;
            this.scaleOffset = null;
            this.color = null;
        };
        return TransformFrame;
    })(dragonBones.Frame);
    dragonBones.TransformFrame = TransformFrame;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.SlotTimeline
     * @extends dragonBones.Timeline
     * @classdesc
     * 插槽的时间轴数据，包含一个和多个关键帧数据
     */
    var SlotTimeline = (function (_super) {
        __extends(SlotTimeline, _super);
        /**
         * 构造函数，实例化一个SlotTimeline
         */
        function SlotTimeline() {
            _super.call(this);
            this.offset = 0;
        }
        /**
         * 释放资源
         */
        SlotTimeline.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
        };
        return SlotTimeline;
    })(dragonBones.Timeline);
    dragonBones.SlotTimeline = SlotTimeline;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////
//
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.SlotFrame
     * @extends dragonBones.Frame
     * @classdesc
     * 插槽的关键帧数据，包含
     * 插槽的显示序号，可见度，zOrder，colorTransform数据
     */
    var SlotFrame = (function (_super) {
        __extends(SlotFrame, _super);
        /**
         *构造函数，实例化一个SlotFrame
         */
        function SlotFrame() {
            _super.call(this);
            /**
             *绑定到该插槽的显示序号，当插槽有多个显示对象时，指定显示哪一个显示对象
             * @member {number} dragonBones.SlotFrame#displayIndex
             */
            this.displayIndex = 0;
            this.tweenEasing = 10;
            this.displayIndex = 0;
            this.visible = true;
            this.zOrder = NaN;
        }
        /**
         *释放资源
         */
        SlotFrame.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.color = null;
        };
        return SlotFrame;
    })(dragonBones.Frame);
    dragonBones.SlotFrame = SlotFrame;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////
//
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.SlotData
     * @classdesc
     * 插槽数据，插槽是由骨骼控制的，可以装入显示对象的容器，显示对象可以是图片或者子骨架
     * 插槽可插入一个或者多个显示对象，但是同一时刻只能显示一个显示对象
     * 插槽支持关键帧动画，如果有多个显示对象，可以指定哪一帧显示哪一个显示对象
     */
    var SlotData = (function () {
        /**
         * 构造函数，实例化一个SlotData类
         */
        function SlotData() {
            this._displayDataList = [];
            this.zOrder = 0;
        }
        /**
         * 释放资源
         */
        SlotData.prototype.dispose = function () {
            this._displayDataList.length = 0;
        };
        /**
         * 添加一个显示对象数据
         * @param displayData
         */
        SlotData.prototype.addDisplayData = function (displayData) {
            if (!displayData) {
                throw new Error();
            }
            if (this._displayDataList.indexOf(displayData) < 0) {
                this._displayDataList[this._displayDataList.length] = displayData;
            }
            else {
                throw new Error();
            }
        };
        /**
         * 根据显示对象的名字获取显示对象数据
         * @param displayName 想要获取的显示对象的名字
         * @returns {*} 返回显示对象昂数据，如果没有返回null
         */
        SlotData.prototype.getDisplayData = function (displayName) {
            var i = this._displayDataList.length;
            while (i--) {
                if (this._displayDataList[i].name == displayName) {
                    return this._displayDataList[i];
                }
            }
            return null;
        };
        Object.defineProperty(SlotData.prototype, "displayDataList", {
            /**
             * 获取所有的显示对象
             * @returns {Array<DisplayData>}
             */
            get: function () {
                return this._displayDataList;
            },
            enumerable: true,
            configurable: true
        });
        return SlotData;
    })();
    dragonBones.SlotData = SlotData;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////
//
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.SkinData
     * @classdesc
     * 皮肤数据，皮肤是由一些插槽组成，每个插槽都有一个骨骼控制，骨骼的运动带动插槽的运动形成动画，
     * 插槽里可以放置显示对象，目前支持的显示对象有图片和子骨架两种
     */
    var SkinData = (function () {
        /**
         * 构造函数，实例化一个SkinData类
         */
        function SkinData() {
            this._slotDataList = [];
        }
        /**
         * 释放资源
         */
        SkinData.prototype.dispose = function () {
            var i = this._slotDataList.length;
            while (i--) {
                this._slotDataList[i].dispose();
            }
            this._slotDataList = null;
        };
        /**
         * 根据插槽的名字获取插槽数据
         * @param slotName 想要获取的插槽的名字
         * @returns {*} 返回的插槽数据
         */
        SkinData.prototype.getSlotData = function (slotName) {
            var i = this._slotDataList.length;
            while (i--) {
                if (this._slotDataList[i].name == slotName) {
                    return this._slotDataList[i];
                }
            }
            return null;
        };
        /**
         * 添加一个插槽数据
         * @param slotData
         */
        SkinData.prototype.addSlotData = function (slotData) {
            if (!slotData) {
                throw new Error();
            }
            if (this._slotDataList.indexOf(slotData) < 0) {
                this._slotDataList[this._slotDataList.length] = slotData;
            }
            else {
                throw new Error();
            }
        };
        Object.defineProperty(SkinData.prototype, "slotDataList", {
            /**
             * 获取所有的插槽数据
             * @returns {Array<SlotData>}
             */
            get: function () {
                return this._slotDataList;
            },
            enumerable: true,
            configurable: true
        });
        return SkinData;
    })();
    dragonBones.SkinData = SkinData;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.DragonBonesData
     * @classdesc
     * DragonBones的数据，包含了骨架数据和显示对象数据
     */
    var DragonBonesData = (function () {
        /**
         * 构造函数，实例化一个DragonBonesData类
         */
        function DragonBonesData() {
            this._armatureDataList = [];
            this._displayDataDictionary = {};
        }
        /**
         * 释放资源
         */
        DragonBonesData.prototype.dispose = function () {
            for (var i = 0, len = this._armatureDataList.length; i < len; i++) {
                var armatureData = this._armatureDataList[i];
                armatureData.dispose();
            }
            this._armatureDataList = null;
            this.removeAllDisplayData();
            this._displayDataDictionary = null;
        };
        Object.defineProperty(DragonBonesData.prototype, "armatureDataList", {
            /**
             * 获取所有的骨架数据
             * @returns {Array<ArmatureData>}
             */
            get: function () {
                return this._armatureDataList;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 通过骨架的名字获取骨架的数据
         * @param armatureName 想要获取的骨架的名字
         * @returns {*} 骨架数据 ArmatureData
         */
        DragonBonesData.prototype.getArmatureDataByName = function (armatureName) {
            var i = this._armatureDataList.length;
            while (i--) {
                if (this._armatureDataList[i].name == armatureName) {
                    return this._armatureDataList[i];
                }
            }
            return null;
        };
        /**
         * 添加一个骨架数据
         * @param armatureData
         */
        DragonBonesData.prototype.addArmatureData = function (armatureData) {
            if (!armatureData) {
                throw new Error();
            }
            if (this._armatureDataList.indexOf(armatureData) < 0) {
                this._armatureDataList[this._armatureDataList.length] = armatureData;
            }
            else {
                throw new Error();
            }
        };
        /**
         * 移除一个骨架数据
         * @param armatureData
         */
        DragonBonesData.prototype.removeArmatureData = function (armatureData) {
            var index = this._armatureDataList.indexOf(armatureData);
            if (index >= 0) {
                this._armatureDataList.splice(index, 1);
            }
        };
        /**
         * 根据骨架的名字，移除该骨架的数据
         * @param armatureName 想要移除的骨架的名字
         */
        DragonBonesData.prototype.removeArmatureDataByName = function (armatureName) {
            var i = this._armatureDataList.length;
            while (i--) {
                if (this._armatureDataList[i].name == armatureName) {
                    this._armatureDataList.splice(i, 1);
                }
            }
        };
        /**
         * 根据名字获取显示对象数据
         * @param name 想要获取的显示对象数据的名字
         * @returns {any} 显示对象数据 DisplayData
         */
        DragonBonesData.prototype.getDisplayDataByName = function (name) {
            return this._displayDataDictionary[name];
        };
        /**
         *添加一个显示对象数据
         * @param displayData 需要被添加的显示对象数据
         */
        DragonBonesData.prototype.addDisplayData = function (displayData) {
            this._displayDataDictionary[displayData.name] = displayData;
        };
        /**
         *根据显示对象的名字移除该显示对象数据
         * @param name 显示对象的名字
         */
        DragonBonesData.prototype.removeDisplayDataByName = function (name) {
            delete this._displayDataDictionary[name];
        };
        /**
         *移除所有的显示对象数据
         */
        DragonBonesData.prototype.removeAllDisplayData = function () {
            for (var name in this._displayDataDictionary) {
                delete this._displayDataDictionary[name];
            }
        };
        return DragonBonesData;
    })();
    dragonBones.DragonBonesData = DragonBonesData;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.DisplayData
     * @classdesc
     * 显示对象的数据，目前支持图片和子骨架
     */
    var DisplayData = (function () {
        /**
         * 初始化变换矩阵为单位矩阵
         * 注册点为{0，0}点
         */
        function DisplayData() {
            this.transform = new dragonBones.DBTransform();
            this.pivot = new dragonBones.Point();
        }
        /**
         * 释放资源
         */
        DisplayData.prototype.dispose = function () {
            this.transform = null;
            this.pivot = null;
        };
        /**
         * 子骨架类型
         */
        DisplayData.ARMATURE = "armature";
        /**
         * 图片类型
         */
        DisplayData.IMAGE = "image";
        return DisplayData;
    })();
    dragonBones.DisplayData = DisplayData;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.DBTransform
     * @classdesc
     * Dragonbones中使用的transform
     * 可以表示位移，旋转，缩放三种属性
     */
    var DBTransform = (function () {
        /**
         * 创建一个 DBTransform 实例.
         */
        function DBTransform() {
            this.x = 0;
            this.y = 0;
            this.skewX = 0;
            this.skewY = 0;
            this.scaleX = 1;
            this.scaleY = 1;
        }
        Object.defineProperty(DBTransform.prototype, "rotation", {
            /**
             * 旋转，用弧度表示
             * @member {number} dragonBones.DBTransform#rotation
             */
            get: function () {
                return this.skewX;
            },
            set: function (value) {
                this.skewX = this.skewY = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 拷贝传入的transfrom实例的所有属性
         * @param node
         */
        DBTransform.prototype.copy = function (transform) {
            this.x = transform.x;
            this.y = transform.y;
            this.skewX = transform.skewX;
            this.skewY = transform.skewY;
            this.scaleX = transform.scaleX;
            this.scaleY = transform.scaleY;
        };
        /**
         * transform加法
         * @param node
         */
        DBTransform.prototype.add = function (transform) {
            this.x += transform.x;
            this.y += transform.y;
            this.skewX += transform.skewX;
            this.skewY += transform.skewY;
            this.scaleX *= transform.scaleX;
            this.scaleY *= transform.scaleY;
        };
        /**
         * transform减法
         * @param node
         */
        DBTransform.prototype.minus = function (transform) {
            this.x -= transform.x;
            this.y -= transform.y;
            this.skewX -= transform.skewX;
            this.skewY -= transform.skewY;
            this.scaleX /= transform.scaleX;
            this.scaleY /= transform.scaleY;
        };
        DBTransform.prototype.normalizeRotation = function () {
            this.skewX = dragonBones.TransformUtil.normalizeRotation(this.skewX);
            this.skewY = dragonBones.TransformUtil.normalizeRotation(this.skewY);
        };
        /**
         * 把DBTransform的所有属性转成用String类型表示
         * @return 一个字符串包含有DBTransform的所有属性
         */
        DBTransform.prototype.toString = function () {
            var string = "x:" + this.x + " y:" + this.y + " skewX:" + this.skewX + " skewY:" + this.skewY + " scaleX:" + this.scaleX + " scaleY:" + this.scaleY;
            return string;
        };
        return DBTransform;
    })();
    dragonBones.DBTransform = DBTransform;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////
var dragonBones;
(function (dragonBones) {
    var CurveData = (function () {
        function CurveData() {
            this._dataChanged = false;
            this._pointList = [];
            this.sampling = new Array(CurveData.SamplingTimes);
            for (var i = 0; i < CurveData.SamplingTimes - 1; i++) {
                this.sampling[i] = new dragonBones.Point();
            }
        }
        CurveData.prototype.getValueByProgress = function (progress) {
            if (this._dataChanged) {
                this.refreshSampling();
            }
            for (var i = 0; i < CurveData.SamplingTimes - 1; i++) {
                var point = this.sampling[i];
                if (point.x >= progress) {
                    if (i == 0) {
                        return point.y * progress / point.x;
                    }
                    else {
                        var prevPoint = this.sampling[i - 1];
                        return prevPoint.y + (point.y - prevPoint.y) * (progress - prevPoint.x) / (point.x - prevPoint.x);
                    }
                }
            }
            return point.y + (1 - point.y) * (progress - point.x) / (1 - point.x);
        };
        CurveData.prototype.refreshSampling = function () {
            for (var i = 0; i < CurveData.SamplingTimes - 1; i++) {
                this.bezierCurve(CurveData.SamplingStep * (i + 1), this.sampling[i]);
            }
            this._dataChanged = false;
        };
        CurveData.prototype.bezierCurve = function (t, outputPoint) {
            var l_t = 1 - t;
            outputPoint.x = 3 * this.point1.x * t * l_t * l_t + 3 * this.point2.x * t * t * l_t + Math.pow(t, 3);
            outputPoint.y = 3 * this.point1.y * t * l_t * l_t + 3 * this.point2.y * t * t * l_t + Math.pow(t, 3);
        };
        Object.defineProperty(CurveData.prototype, "pointList", {
            get: function () {
                return this._pointList;
            },
            set: function (value) {
                this._pointList = value;
                this._dataChanged = true;
            },
            enumerable: true,
            configurable: true
        });
        CurveData.prototype.isCurve = function () {
            return this.point1.x != 0 || this.point1.y != 0 || this.point2.x != 1 || this.point2.y != 1;
        };
        Object.defineProperty(CurveData.prototype, "point1", {
            get: function () {
                return this.pointList[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CurveData.prototype, "point2", {
            get: function () {
                return this.pointList[1];
            },
            enumerable: true,
            configurable: true
        });
        CurveData.SamplingTimes = 20;
        CurveData.SamplingStep = 0.05;
        return CurveData;
    })();
    dragonBones.CurveData = CurveData;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////

var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.BoneData
     * @classdesc
     * 骨骼数据
     */
    var BoneData = (function () {
        /**
         * 初始化各个属性
         */
        function BoneData() {
            this.length = 0;
            this.global = new dragonBones.DBTransform();
            this.transform = new dragonBones.DBTransform();
            this.inheritRotation = true;
            this.inheritScale = false;
        }
        /**
         *释放资源
         */
        BoneData.prototype.dispose = function () {
            this.global = null;
            this.transform = null;
        };
        return BoneData;
    })();
    dragonBones.BoneData = BoneData;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.ArmatureData
     * @classdesc
     * armature数据 一个armature数据包含一个角色的骨骼，皮肤，动画的数据
     * @see  dragonBones.BoneData
     * @see  dragonBones.SkinData
     * @see  dragonBones.AnimationData
     */
    var ArmatureData = (function () {
        /**
         * 创建一个ArmatureData实例
         */
        function ArmatureData() {
            this._boneDataList = [];
            this._skinDataList = [];
            this._slotDataList = [];
            this._animationDataList = [];
            //_areaDataList = new Vector.<IAreaData>(0, true);
        }
        ArmatureData.sortBoneDataHelpArray = function (object1, object2) {
            return object1[0] > object2[0] ? 1 : -1;
        };
        ArmatureData.sortBoneDataHelpArrayDescending = function (object1, object2) {
            return object1[0] > object2[0] ? -1 : 1;
        };
        ArmatureData.prototype.setSkinData = function (skinName) {
            var i = 0;
            var len = this._slotDataList.length;
            for (i = 0; i < len; i++) {
                this._slotDataList[i].dispose();
            }
            var skinData;
            if (!skinName && this._skinDataList.length > 0) {
                skinData = this._skinDataList[0];
            }
            else {
                i = 0,
                    len = this._skinDataList.length;
                for (; i < len; i++) {
                    if (this._skinDataList[i].name == skinName) {
                        skinData = this._skinDataList[i];
                        break;
                    }
                }
            }
            if (skinData) {
                var slotData;
                i = 0, len = skinData.slotDataList.length;
                for (i = 0; i < len; i++) {
                    slotData = this.getSlotData(skinData.slotDataList[i].name);
                    if (slotData) {
                        var j = 0;
                        var jLen = skinData.slotDataList[i].displayDataList.length;
                        for (j = 0; j < jLen; j++) {
                            slotData.addDisplayData(skinData.slotDataList[i].displayDataList[j]);
                        }
                    }
                }
            }
        };
        /**
         * 释放资源
         */
        ArmatureData.prototype.dispose = function () {
            var i = this._boneDataList.length;
            while (i--) {
                this._boneDataList[i].dispose();
            }
            i = this._skinDataList.length;
            while (i--) {
                this._skinDataList[i].dispose();
            }
            i = this._slotDataList.length;
            while (i--) {
                this._slotDataList[i].dispose();
            }
            i = this._animationDataList.length;
            while (i--) {
                this._animationDataList[i].dispose();
            }
            this._boneDataList = null;
            this._slotDataList = null;
            this._skinDataList = null;
            this._animationDataList = null;
        };
        /**
         * 根据骨骼的名字获取到骨骼数据
         * @param boneName 骨骼的名字
         * @returns {*} 骨骼数据
         */
        ArmatureData.prototype.getBoneData = function (boneName) {
            var i = this._boneDataList.length;
            while (i--) {
                if (this._boneDataList[i].name == boneName) {
                    return this._boneDataList[i];
                }
            }
            return null;
        };
        ArmatureData.prototype.getSlotData = function (slotName) {
            var i = this._slotDataList.length;
            while (i--) {
                if (this._slotDataList[i].name == slotName) {
                    return this._slotDataList[i];
                }
            }
            return null;
        };
        /**
         * 根据皮肤的名字获取到皮肤数据
         * @param skinName  皮肤的名字
         * @returns {*}  皮肤数据
         */
        ArmatureData.prototype.getSkinData = function (skinName) {
            if (!skinName && this._skinDataList.length > 0) {
                return this._skinDataList[0];
            }
            var i = this._skinDataList.length;
            while (i--) {
                if (this._skinDataList[i].name == skinName) {
                    return this._skinDataList[i];
                }
            }
            return null;
        };
        /**
         * 根据动画的名字获取动画数据
         * @param animationName 动画的名字
         * @returns {*} 动画数据
         */
        ArmatureData.prototype.getAnimationData = function (animationName) {
            var i = this._animationDataList.length;
            while (i--) {
                if (this._animationDataList[i].name == animationName) {
                    return this._animationDataList[i];
                }
            }
            return null;
        };
        /**
         *添加一个骨骼数据
         * @param boneData
         */
        ArmatureData.prototype.addBoneData = function (boneData) {
            if (!boneData) {
                throw new Error();
            }
            if (this._boneDataList.indexOf(boneData) < 0) {
                this._boneDataList[this._boneDataList.length] = boneData;
            }
            else {
                throw new Error();
            }
        };
        ArmatureData.prototype.addSlotData = function (slotData) {
            if (!slotData) {
                throw new Error();
            }
            if (this._slotDataList.indexOf(slotData) < 0) {
                this._slotDataList[this._slotDataList.length] = slotData;
            }
            else {
                throw new Error();
            }
        };
        /**
         * 添加一个皮肤数据
         * @param skinData
         */
        ArmatureData.prototype.addSkinData = function (skinData) {
            if (!skinData) {
                throw new Error();
            }
            if (this._skinDataList.indexOf(skinData) < 0) {
                this._skinDataList[this._skinDataList.length] = skinData;
            }
            else {
                throw new Error();
            }
        };
        /**
         * 添加一个动画数据
         * @param animationData
         */
        ArmatureData.prototype.addAnimationData = function (animationData) {
            if (!animationData) {
                throw new Error();
            }
            if (this._animationDataList.indexOf(animationData) < 0) {
                this._animationDataList[this._animationDataList.length] = animationData;
            }
        };
        /**
         * 对骨骼按照骨骼数的层级关系排序
         */
        ArmatureData.prototype.sortBoneDataList = function () {
            var i = this._boneDataList.length;
            if (i == 0) {
                return;
            }
            var helpArray = [];
            while (i--) {
                var boneData = this._boneDataList[i];
                var level = 0;
                var parentData = boneData;
                while (parentData) {
                    level++;
                    parentData = this.getBoneData(parentData.parent);
                }
                helpArray[i] = [level, boneData];
            }
            helpArray.sort(ArmatureData.sortBoneDataHelpArray);
            i = helpArray.length;
            while (i--) {
                this._boneDataList[i] = helpArray[i][1];
            }
        };
        Object.defineProperty(ArmatureData.prototype, "boneDataList", {
            /**
             * 获取骨骼数据列表
             * @returns {Array<BoneData>}
             */
            get: function () {
                return this._boneDataList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArmatureData.prototype, "slotDataList", {
            get: function () {
                return this._slotDataList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArmatureData.prototype, "skinDataList", {
            /**
             * 获取皮肤数据列表
             * @returns {Array<SkinData>}
             */
            get: function () {
                return this._skinDataList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArmatureData.prototype, "animationDataList", {
            /**
             * 获得动画数据列表
             * @returns {Array<AnimationData>}
             */
            get: function () {
                return this._animationDataList;
            },
            enumerable: true,
            configurable: true
        });
        return ArmatureData;
    })();
    dragonBones.ArmatureData = ArmatureData;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonbones.AnimationData
     * @extends dragonbones.Timeline
     * @classdesc
     * 保存动画数据
     */
    var AnimationData = (function (_super) {
        __extends(AnimationData, _super);
        /**
         * 创建一个AnimationData实例
         */
        function AnimationData() {
            _super.call(this);
            /**
             * 动画的帧率，表示每一秒钟播放多少帧
             * @member {number} dragonBones.AnimationData#frameRate
             */
            this.frameRate = 0;
            /**
             * 	播放次数 0为一直播放，默认为0
             * @member {number} dragonBones.AnimationData#playTimes
             */
            this.playTimes = 0;
            /**
             * 最后一帧持续的帧数
             * @member {number} dragonBones.AnimationData#lastFrameDuration
             */
            this.lastFrameDuration = 0;
            this.fadeTime = 0;
            this.playTimes = 0;
            this.autoTween = true;
            this.tweenEasing = NaN;
            this.hideTimelineNameMap = [];
            this.hideSlotTimelineNameMap = [];
            this._timelineList = [];
            this._slotTimelineList = [];
        }
        Object.defineProperty(AnimationData.prototype, "timelineList", {
            /**
             * 时间轴列表
             * @returns {Array<TransformTimeline>}
             */
            get: function () {
                return this._timelineList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationData.prototype, "slotTimelineList", {
            get: function () {
                return this._slotTimelineList;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 释放资源
         */
        AnimationData.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.hideTimelineNameMap = null;
            var i = 0;
            var len = 0;
            for (i = 0, len = this._timelineList.length; i < len; i++) {
                var timeline = this._timelineList[i];
                timeline.dispose();
            }
            this._timelineList = null;
            for (i = 0, len = this._slotTimelineList.length; i < len; i++) {
                var slotTimeline = this._slotTimelineList[i];
                slotTimeline.dispose();
            }
            this._slotTimelineList = null;
        };
        /**
         * 根据时间轴的名字获取时间轴数据
         * @param timelineName 时间轴的名字
         * @returns {*} 时间轴数据
         */
        AnimationData.prototype.getTimeline = function (timelineName) {
            var i = this._timelineList.length;
            while (i--) {
                if (this._timelineList[i].name == timelineName) {
                    return this._timelineList[i];
                }
            }
            return null;
        };
        /**
         * 添加一个时间轴数据
         * @param timeline 需要被添加的时间轴数据
         */
        AnimationData.prototype.addTimeline = function (timeline) {
            if (!timeline) {
                throw new Error();
            }
            if (this._timelineList.indexOf(timeline) < 0) {
                this._timelineList[this._timelineList.length] = timeline;
            }
        };
        AnimationData.prototype.getSlotTimeline = function (timelineName) {
            var i = this._slotTimelineList.length;
            while (i--) {
                if (this._slotTimelineList[i].name == timelineName) {
                    return this._slotTimelineList[i];
                }
            }
            return null;
        };
        AnimationData.prototype.addSlotTimeline = function (timeline) {
            if (!timeline) {
                throw new Error();
            }
            if (this._slotTimelineList.indexOf(timeline) < 0) {
                this._slotTimelineList[this._slotTimelineList.length] = timeline;
            }
        };
        return AnimationData;
    })(dragonBones.Timeline);
    dragonBones.AnimationData = AnimationData;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.geom
     * @classdesc
     * Rectangle 对象是按其位置（由它左上角的点 (x, y) 确定）以及宽度和高度定义的区域。
     * Rectangle 类的 x、y、width 和 height 属性相互独立；更改一个属性的值不会影响其他属性。
     */
    var Rectangle = (function () {
        /**
         *创建一个新 Rectangle 对象，其左上角由 x 和 y 参数指定，并具有指定的 width 和 height 参数。
         * @param x 矩形左上角的 x 坐标。
         * @param y 矩形左上角的 y 坐标。
         * @param width 矩形的宽度（以像素为单位）
         * @param height 矩形的高度（以像素为单位）。
         */
        function Rectangle(x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        return Rectangle;
    })();
    dragonBones.Rectangle = Rectangle;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.Point
     * @classdesc
     * Point 对象表示二维坐标系统中的某个位置，其中 x 表示水平轴，y 表示垂直轴。
     * 下面的代码在 (0,0) 处创建一个点：
     *   var myPoint:Point = new Point();
     */
    var Point = (function () {
        /**
         *创建一个新点。
         * @param x 该点的水平坐标。
         * @param y 该点的垂直坐标。
         */
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        /**
         *返回包含 x 和 y 坐标的值的字符串。
         * @returns {string}
         */
        Point.prototype.toString = function () {
            return "[Point (x=" + this.x + " y=" + this.y + ")]";
        };
        return Point;
    })();
    dragonBones.Point = Point;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.FastSlotTimelineState
     * @classdesc
     * FastSlotTimelineState 负责计算 Slot 的时间轴动画。
     * FastSlotTimelineState 实例隶属于 FastAnimationState. FastAnimationState在创建时会为每个包含动作的 Slot生成一个 FastSlotTimelineState 实例.
     * @see dragonBones.FastAnimation
     * @see dragonBones.FastAnimationState
     * @see dragonBones.FastSlot
     */
    var FastSlotTimelineState = (function () {
        function FastSlotTimelineState() {
            this._totalTime = 0; //duration
            this._currentTime = 0;
            this._currentFrameIndex = 0;
            this._currentFramePosition = 0;
            this._currentFrameDuration = 0;
            //-1: frameLength>1, 0:frameLength==0, 1:frameLength==1
            this._updateMode = 0;
            this._durationColor = new dragonBones.ColorTransform();
        }
        /** @private */
        FastSlotTimelineState.borrowObject = function () {
            if (FastSlotTimelineState._pool.length == 0) {
                return new FastSlotTimelineState();
            }
            return FastSlotTimelineState._pool.pop();
        };
        /** @private */
        FastSlotTimelineState.returnObject = function (timeline) {
            if (FastSlotTimelineState._pool.indexOf(timeline) < 0) {
                FastSlotTimelineState._pool[FastSlotTimelineState._pool.length] = timeline;
            }
            timeline.clear();
        };
        /** @private */
        FastSlotTimelineState.clear = function () {
            var i = FastSlotTimelineState._pool.length;
            while (i--) {
                FastSlotTimelineState._pool[i].clear();
            }
            FastSlotTimelineState._pool.length = 0;
        };
        FastSlotTimelineState.prototype.clear = function () {
            this._slot = null;
            this._armature = null;
            this._animation = null;
            this._animationState = null;
            this._timelineData = null;
        };
        //动画开始结束
        /** @private */
        FastSlotTimelineState.prototype.fadeIn = function (slot, animationState, timelineData) {
            this._slot = slot;
            this._armature = this._slot.armature;
            this._animation = this._armature.animation;
            this._animationState = animationState;
            this._timelineData = timelineData;
            this.name = timelineData.name;
            this._totalTime = this._timelineData.duration;
            this._isComplete = false;
            this._blendEnabled = false;
            this._tweenColor = false;
            this._currentFrameIndex = -1;
            this._currentTime = -1;
            this._tweenEasing = NaN;
            this._weight = 1;
            switch (this._timelineData.frameList.length) {
                case 0:
                    this._updateMode = 0;
                    break;
                case 1:
                    this._updateMode = 1;
                    break;
                default:
                    this._updateMode = -1;
                    break;
            }
        };
        //动画进行中
        /** @private */
        FastSlotTimelineState.prototype.updateFade = function (progress) {
        };
        /** @private */
        FastSlotTimelineState.prototype.update = function (progress) {
            if (this._updateMode == -1) {
                this.updateMultipleFrame(progress);
            }
            else if (this._updateMode == 1) {
                this._updateMode = 0;
                this.updateSingleFrame();
            }
        };
        FastSlotTimelineState.prototype.updateMultipleFrame = function (progress) {
            var currentPlayTimes = 0;
            progress /= this._timelineData.scale;
            progress += this._timelineData.offset;
            var currentTime = this._totalTime * progress;
            var playTimes = this._animationState.playTimes;
            if (playTimes == 0) {
                this._isComplete = false;
                currentPlayTimes = Math.ceil(Math.abs(currentTime) / this._totalTime) || 1;
                currentTime -= Math.floor(currentTime / this._totalTime) * this._totalTime;
                if (currentTime < 0) {
                    currentTime += this._totalTime;
                }
            }
            else {
                var totalTimes = playTimes * this._totalTime;
                if (currentTime >= totalTimes) {
                    currentTime = totalTimes;
                    this._isComplete = true;
                }
                else if (currentTime <= -totalTimes) {
                    currentTime = -totalTimes;
                    this._isComplete = true;
                }
                else {
                    this._isComplete = false;
                }
                if (currentTime < 0) {
                    currentTime += totalTimes;
                }
                currentPlayTimes = Math.ceil(currentTime / this._totalTime) || 1;
                if (this._isComplete) {
                    currentTime = this._totalTime;
                }
                else {
                    currentTime -= Math.floor(currentTime / this._totalTime) * this._totalTime;
                }
            }
            if (this._currentTime != currentTime) {
                this._currentTime = currentTime;
                var frameList = this._timelineData.frameList;
                var prevFrame;
                var currentFrame;
                for (var i = 0, l = this._timelineData.frameList.length; i < l; ++i) {
                    if (this._currentFrameIndex < 0) {
                        this._currentFrameIndex = 0;
                    }
                    else if (this._currentTime < this._currentFramePosition || this._currentTime >= this._currentFramePosition + this._currentFrameDuration) {
                        this._currentFrameIndex++;
                        if (this._currentFrameIndex >= frameList.length) {
                            if (this._isComplete) {
                                this._currentFrameIndex--;
                                break;
                            }
                            else {
                                this._currentFrameIndex = 0;
                            }
                        }
                    }
                    else {
                        break;
                    }
                    currentFrame = (frameList[this._currentFrameIndex]);
                    if (prevFrame) {
                        this._slot._arriveAtFrame(prevFrame, this._animationState);
                    }
                    this._currentFrameDuration = currentFrame.duration;
                    this._currentFramePosition = currentFrame.position;
                    prevFrame = currentFrame;
                }
                if (currentFrame) {
                    this._slot._arriveAtFrame(currentFrame, this._animationState);
                    this._blendEnabled = currentFrame.displayIndex >= 0;
                    if (this._blendEnabled) {
                        this.updateToNextFrame(currentPlayTimes);
                    }
                    else {
                        this._tweenEasing = NaN;
                        this._tweenColor = false;
                    }
                }
                if (this._blendEnabled) {
                    this.updateTween();
                }
            }
        };
        FastSlotTimelineState.prototype.updateToNextFrame = function (currentPlayTimes) {
            if (currentPlayTimes === void 0) { currentPlayTimes = 0; }
            var nextFrameIndex = this._currentFrameIndex + 1;
            if (nextFrameIndex >= this._timelineData.frameList.length) {
                nextFrameIndex = 0;
            }
            var currentFrame = (this._timelineData.frameList[this._currentFrameIndex]);
            var nextFrame = (this._timelineData.frameList[nextFrameIndex]);
            var tweenEnabled = false;
            if (nextFrameIndex == 0 &&
                (this._animationState.playTimes &&
                    this._animationState.currentPlayTimes >= this._animationState.playTimes &&
                    ((this._currentFramePosition + this._currentFrameDuration) / this._totalTime + currentPlayTimes - this._timelineData.offset) * this._timelineData.scale > 0.999999)) {
                this._tweenEasing = NaN;
                tweenEnabled = false;
            }
            else if (currentFrame.displayIndex < 0 || nextFrame.displayIndex < 0) {
                this._tweenEasing = NaN;
                tweenEnabled = false;
            }
            else if (this._animationState.autoTween) {
                this._tweenEasing = this._animationState.animationData.tweenEasing;
                if (isNaN(this._tweenEasing)) {
                    this._tweenEasing = currentFrame.tweenEasing;
                    this._tweenCurve = currentFrame.curve;
                    if (isNaN(this._tweenEasing) && this._tweenCurve == null) {
                        tweenEnabled = false;
                    }
                    else {
                        if (this._tweenEasing == 10) {
                            this._tweenEasing = 0;
                        }
                        //_tweenEasing [-1, 0) 0 (0, 1] (1, 2]
                        tweenEnabled = true;
                    }
                }
                else {
                    //_tweenEasing [-1, 0) 0 (0, 1] (1, 2]
                    tweenEnabled = true;
                }
            }
            else {
                this._tweenEasing = currentFrame.tweenEasing;
                this._tweenCurve = currentFrame.curve;
                if ((isNaN(this._tweenEasing) || this._tweenEasing == 10) && this._tweenCurve == null) {
                    this._tweenEasing = NaN;
                    tweenEnabled = false;
                }
                else {
                    //_tweenEasing [-1, 0) 0 (0, 1] (1, 2]
                    tweenEnabled = true;
                }
            }
            if (tweenEnabled) {
                if (currentFrame.color || nextFrame.color) {
                    dragonBones.ColorTransformUtil.minus(nextFrame.color || dragonBones.ColorTransformUtil.originalColor, currentFrame.color || dragonBones.ColorTransformUtil.originalColor, this._durationColor);
                    this._tweenColor = this._durationColor.alphaOffset != 0 ||
                        this._durationColor.redOffset != 0 ||
                        this._durationColor.greenOffset != 0 ||
                        this._durationColor.blueOffset != 0 ||
                        this._durationColor.alphaMultiplier != 0 ||
                        this._durationColor.redMultiplier != 0 ||
                        this._durationColor.greenMultiplier != 0 ||
                        this._durationColor.blueMultiplier != 0;
                }
                else {
                    this._tweenColor = false;
                }
            }
            else {
                this._tweenColor = false;
            }
            if (!this._tweenColor) {
                var targetColor;
                var colorChanged;
                if (currentFrame.color) {
                    targetColor = currentFrame.color;
                    colorChanged = true;
                }
                else {
                    targetColor = dragonBones.ColorTransformUtil.originalColor;
                    colorChanged = false;
                }
                if ((this._slot._isColorChanged || colorChanged)) {
                    if (!dragonBones.ColorTransformUtil.isEqual(this._slot._colorTransform, targetColor)) {
                        this._slot._updateDisplayColor(targetColor.alphaOffset, targetColor.redOffset, targetColor.greenOffset, targetColor.blueOffset, targetColor.alphaMultiplier, targetColor.redMultiplier, targetColor.greenMultiplier, targetColor.blueMultiplier, colorChanged);
                    }
                }
            }
        };
        FastSlotTimelineState.prototype.updateTween = function () {
            var currentFrame = (this._timelineData.frameList[this._currentFrameIndex]);
            if (this._tweenColor) {
                var progress = (this._currentTime - this._currentFramePosition) / this._currentFrameDuration;
                if (this._tweenCurve != null) {
                    progress = this._tweenCurve.getValueByProgress(progress);
                }
                else if (this._tweenEasing) {
                    progress = dragonBones.MathUtil.getEaseValue(progress, this._tweenEasing);
                }
                if (currentFrame.color) {
                    this._slot._updateDisplayColor(currentFrame.color.alphaOffset + this._durationColor.alphaOffset * progress, currentFrame.color.redOffset + this._durationColor.redOffset * progress, currentFrame.color.greenOffset + this._durationColor.greenOffset * progress, currentFrame.color.blueOffset + this._durationColor.blueOffset * progress, currentFrame.color.alphaMultiplier + this._durationColor.alphaMultiplier * progress, currentFrame.color.redMultiplier + this._durationColor.redMultiplier * progress, currentFrame.color.greenMultiplier + this._durationColor.greenMultiplier * progress, currentFrame.color.blueMultiplier + this._durationColor.blueMultiplier * progress, true);
                }
                else {
                    this._slot._updateDisplayColor(this._durationColor.alphaOffset * progress, this._durationColor.redOffset * progress, this._durationColor.greenOffset * progress, this._durationColor.blueOffset * progress, this._durationColor.alphaMultiplier * progress + 1, this._durationColor.redMultiplier * progress + 1, this._durationColor.greenMultiplier * progress + 1, this._durationColor.blueMultiplier * progress + 1, true);
                }
            }
        };
        FastSlotTimelineState.prototype.updateSingleFrame = function () {
            var currentFrame = (this._timelineData.frameList[0]);
            this._slot._arriveAtFrame(currentFrame, this._animationState);
            this._isComplete = true;
            this._tweenEasing = NaN;
            this._tweenColor = false;
            this._blendEnabled = currentFrame.displayIndex >= 0;
            if (this._blendEnabled) {
                var targetColor;
                var colorChanged;
                if (currentFrame.color) {
                    targetColor = currentFrame.color;
                    colorChanged = true;
                }
                else {
                    targetColor = dragonBones.ColorTransformUtil.originalColor;
                    colorChanged = false;
                }
                if ((this._slot._isColorChanged || colorChanged)) {
                    if (!dragonBones.ColorTransformUtil.isEqual(this._slot._colorTransform, targetColor)) {
                        this._slot._updateDisplayColor(targetColor.alphaOffset, targetColor.redOffset, targetColor.greenOffset, targetColor.blueOffset, targetColor.alphaMultiplier, targetColor.redMultiplier, targetColor.greenMultiplier, targetColor.blueMultiplier, colorChanged);
                    }
                }
            }
        };
        FastSlotTimelineState.HALF_PI = Math.PI * 0.5;
        FastSlotTimelineState.DOUBLE_PI = Math.PI * 2;
        FastSlotTimelineState._pool = [];
        return FastSlotTimelineState;
    })();
    dragonBones.FastSlotTimelineState = FastSlotTimelineState;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.FastBoneTimelineState
     * @classdesc
     * FastBoneTimelineState 负责计算 Bone 的时间轴动画。
     * FastBoneTimelineState 实例隶属于 FastAnimationState. FastAnimationState在创建时会为每个包含动作的 FastBone生成一个 FastBoneTimelineState 实例.
     * @see dragonBones.FastAnimation
     * @see dragonBones.FastAnimationState
     * @see dragonBones.FastBone
     */
    var FastBoneTimelineState = (function () {
        function FastBoneTimelineState() {
            this._totalTime = 0; //duration
            this._currentTime = 0;
            this._lastTime = 0;
            this._currentFrameIndex = 0;
            this._currentFramePosition = 0;
            this._currentFrameDuration = 0;
            this._updateMode = 0;
            this._transform = new dragonBones.DBTransform();
            this._durationTransform = new dragonBones.DBTransform();
            this._transformToFadein = new dragonBones.DBTransform();
        }
        /** @private */
        FastBoneTimelineState.borrowObject = function () {
            if (FastBoneTimelineState._pool.length == 0) {
                return new FastBoneTimelineState();
            }
            return FastBoneTimelineState._pool.pop();
        };
        /** @private */
        FastBoneTimelineState.returnObject = function (timeline) {
            if (FastBoneTimelineState._pool.indexOf(timeline) < 0) {
                FastBoneTimelineState._pool[FastBoneTimelineState._pool.length] = timeline;
            }
            timeline.clear();
        };
        /** @private */
        FastBoneTimelineState.clear = function () {
            var i = FastBoneTimelineState._pool.length;
            while (i--) {
                FastBoneTimelineState._pool[i].clear();
            }
            FastBoneTimelineState._pool.length = 0;
        };
        FastBoneTimelineState.prototype.clear = function () {
            if (this._bone) {
                this._bone._timelineState = null;
                this._bone = null;
            }
            this._animationState = null;
            this._timelineData = null;
        };
        /** @private */
        FastBoneTimelineState.prototype.fadeIn = function (bone, animationState, timelineData) {
            this._bone = bone;
            this._animationState = animationState;
            this._timelineData = timelineData;
            this.name = timelineData.name;
            this._totalTime = this._timelineData.duration;
            this._isComplete = false;
            this._tweenTransform = false;
            this._currentFrameIndex = -1;
            this._currentTime = -1;
            this._tweenEasing = NaN;
            switch (this._timelineData.frameList.length) {
                case 0:
                    this._updateMode = 0;
                    break;
                case 1:
                    this._updateMode = 1;
                    break;
                default:
                    this._updateMode = -1;
                    break;
            }
            if (animationState._fadeTotalTime > 0) {
                var pivotToFadein;
                if (this._bone._timelineState) {
                    this._transformToFadein.copy(this._bone._timelineState._transform);
                }
                else {
                    this._transformToFadein = new dragonBones.DBTransform();
                }
                var firstFrame = (this._timelineData.frameList[0]);
                this._durationTransform.copy(firstFrame.transform);
                this._durationTransform.minus(this._transformToFadein);
            }
            this._bone._timelineState = this;
        };
        /** @private */
        FastBoneTimelineState.prototype.updateFade = function (progress) {
            this._transform.x = this._transformToFadein.x + this._durationTransform.x * progress;
            this._transform.y = this._transformToFadein.y + this._durationTransform.y * progress;
            this._transform.scaleX = this._transformToFadein.scaleX * (1 + (this._durationTransform.scaleX - 1) * progress);
            this._transform.scaleY = this._transformToFadein.scaleX * (1 + (this._durationTransform.scaleY - 1) * progress);
            this._transform.rotation = this._transformToFadein.rotation + this._durationTransform.rotation * progress;
            this._bone.invalidUpdate();
        };
        /** @private */
        FastBoneTimelineState.prototype.update = function (progress) {
            if (this._updateMode == 1) {
                this._updateMode = 0;
                this.updateSingleFrame();
            }
            else if (this._updateMode == -1) {
                this.updateMultipleFrame(progress);
            }
        };
        FastBoneTimelineState.prototype.updateSingleFrame = function () {
            var currentFrame = (this._timelineData.frameList[0]);
            this._bone.arriveAtFrame(currentFrame, this._animationState);
            this._isComplete = true;
            this._tweenEasing = NaN;
            this._tweenTransform = false;
            this._transform.copy(currentFrame.transform);
            this._bone.invalidUpdate();
        };
        FastBoneTimelineState.prototype.updateMultipleFrame = function (progress) {
            var currentPlayTimes = 0;
            progress /= this._timelineData.scale;
            progress += this._timelineData.offset;
            var currentTime = this._totalTime * progress;
            var playTimes = this._animationState.playTimes;
            if (playTimes == 0) {
                this._isComplete = false;
                currentPlayTimes = Math.ceil(Math.abs(currentTime) / this._totalTime) || 1;
                currentTime -= Math.floor(currentTime / this._totalTime) * this._totalTime;
                if (currentTime < 0) {
                    currentTime += this._totalTime;
                }
            }
            else {
                var totalTimes = playTimes * this._totalTime;
                if (currentTime >= totalTimes) {
                    currentTime = totalTimes;
                    this._isComplete = true;
                }
                else if (currentTime <= -totalTimes) {
                    currentTime = -totalTimes;
                    this._isComplete = true;
                }
                else {
                    this._isComplete = false;
                }
                if (currentTime < 0) {
                    currentTime += totalTimes;
                }
                currentPlayTimes = Math.ceil(currentTime / this._totalTime) || 1;
                if (this._isComplete) {
                    currentTime = this._totalTime;
                }
                else {
                    currentTime -= Math.floor(currentTime / this._totalTime) * this._totalTime;
                }
            }
            if (this._currentTime != currentTime) {
                this._lastTime = this._currentTime;
                this._currentTime = currentTime;
                var frameList = this._timelineData.frameList;
                var prevFrame;
                var currentFrame;
                for (var i = 0, l = this._timelineData.frameList.length; i < l; ++i) {
                    if (this._currentFrameIndex < 0) {
                        this._currentFrameIndex = 0;
                    }
                    else if (this._currentTime < this._currentFramePosition || this._currentTime >= this._currentFramePosition + this._currentFrameDuration || this._currentTime < this._lastTime) {
                        this._currentFrameIndex++;
                        this._lastTime = this._currentTime;
                        if (this._currentFrameIndex >= frameList.length) {
                            if (this._isComplete) {
                                this._currentFrameIndex--;
                                break;
                            }
                            else {
                                this._currentFrameIndex = 0;
                            }
                        }
                    }
                    else {
                        break;
                    }
                    currentFrame = (frameList[this._currentFrameIndex]);
                    if (prevFrame) {
                        this._bone.arriveAtFrame(prevFrame, this._animationState);
                    }
                    this._currentFrameDuration = currentFrame.duration;
                    this._currentFramePosition = currentFrame.position;
                    prevFrame = currentFrame;
                }
                if (currentFrame) {
                    this._bone.arriveAtFrame(currentFrame, this._animationState);
                    this.updateToNextFrame(currentPlayTimes);
                }
                if (this._tweenTransform) {
                    this.updateTween();
                }
            }
        };
        FastBoneTimelineState.prototype.updateToNextFrame = function (currentPlayTimes) {
            if (currentPlayTimes === void 0) { currentPlayTimes = 0; }
            var nextFrameIndex = this._currentFrameIndex + 1;
            if (nextFrameIndex >= this._timelineData.frameList.length) {
                nextFrameIndex = 0;
            }
            var currentFrame = (this._timelineData.frameList[this._currentFrameIndex]);
            var nextFrame = (this._timelineData.frameList[nextFrameIndex]);
            var tweenEnabled = false;
            if (nextFrameIndex == 0 && (this._animationState.playTimes &&
                this._animationState.currentPlayTimes >= this._animationState.playTimes &&
                ((this._currentFramePosition + this._currentFrameDuration) / this._totalTime + currentPlayTimes - this._timelineData.offset) * this._timelineData.scale > 0.999999)) {
                this._tweenEasing = NaN;
                tweenEnabled = false;
            }
            else if (this._animationState.autoTween) {
                this._tweenEasing = this._animationState.animationData.tweenEasing;
                if (isNaN(this._tweenEasing)) {
                    this._tweenEasing = currentFrame.tweenEasing;
                    this._tweenCurve = currentFrame.curve;
                    if (isNaN(this._tweenEasing) && this._tweenCurve == null) {
                        tweenEnabled = false;
                    }
                    else {
                        if (this._tweenEasing == 10) {
                            this._tweenEasing = 0;
                        }
                        //_tweenEasing [-1, 0) 0 (0, 1] (1, 2]
                        tweenEnabled = true;
                    }
                }
                else {
                    //_tweenEasing [-1, 0) 0 (0, 1] (1, 2]
                    tweenEnabled = true;
                }
            }
            else {
                this._tweenEasing = currentFrame.tweenEasing;
                this._tweenCurve = currentFrame.curve;
                if ((isNaN(this._tweenEasing) || this._tweenEasing == 10) && this._tweenCurve == null) {
                    this._tweenEasing = NaN;
                    tweenEnabled = false;
                }
                else {
                    //_tweenEasing [-1, 0) 0 (0, 1] (1, 2]
                    tweenEnabled = true;
                }
            }
            if (tweenEnabled) {
                //transform
                this._durationTransform.x = nextFrame.transform.x - currentFrame.transform.x;
                this._durationTransform.y = nextFrame.transform.y - currentFrame.transform.y;
                this._durationTransform.skewX = nextFrame.transform.skewX - currentFrame.transform.skewX;
                this._durationTransform.skewY = nextFrame.transform.skewY - currentFrame.transform.skewY;
                this._durationTransform.scaleX = nextFrame.transform.scaleX - currentFrame.transform.scaleX + nextFrame.scaleOffset.x;
                this._durationTransform.scaleY = nextFrame.transform.scaleY - currentFrame.transform.scaleY + nextFrame.scaleOffset.y;
                this._durationTransform.normalizeRotation();
                if (nextFrameIndex == 0) {
                    this._durationTransform.skewX = dragonBones.TransformUtil.formatRadian(this._durationTransform.skewX);
                    this._durationTransform.skewY = dragonBones.TransformUtil.formatRadian(this._durationTransform.skewY);
                }
                if (this._durationTransform.x ||
                    this._durationTransform.y ||
                    this._durationTransform.skewX ||
                    this._durationTransform.skewY ||
                    this._durationTransform.scaleX != 1 ||
                    this._durationTransform.scaleY != 1 //||
                ) {
                    this._tweenTransform = true;
                }
                else {
                    this._tweenTransform = false;
                }
            }
            else {
                this._tweenTransform = false;
            }
            if (!this._tweenTransform) {
                this._transform.copy(currentFrame.transform);
                this._bone.invalidUpdate();
            }
        };
        FastBoneTimelineState.prototype.updateTween = function () {
            var progress = (this._currentTime - this._currentFramePosition) / this._currentFrameDuration;
            if (this._tweenCurve) {
                progress = this._tweenCurve.getValueByProgress(progress);
            }
            else if (this._tweenEasing) {
                progress = dragonBones.MathUtil.getEaseValue(progress, this._tweenEasing);
            }
            var currentFrame = (this._timelineData.frameList[this._currentFrameIndex]);
            var currentTransform = currentFrame.transform;
            var currentPivot = currentFrame.pivot;
            //normal blending
            this._transform.x = currentTransform.x + this._durationTransform.x * progress;
            this._transform.y = currentTransform.y + this._durationTransform.y * progress;
            this._transform.skewX = currentTransform.skewX + this._durationTransform.skewX * progress;
            this._transform.skewY = currentTransform.skewY + this._durationTransform.skewY * progress;
            this._transform.scaleX = currentTransform.scaleX + this._durationTransform.scaleX * progress;
            this._transform.scaleY = currentTransform.scaleY + this._durationTransform.scaleY * progress;
            this._bone.invalidUpdate();
        };
        FastBoneTimelineState._pool = [];
        return FastBoneTimelineState;
    })();
    dragonBones.FastBoneTimelineState = FastBoneTimelineState;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.FastAnimationState
     * @classdesc
     * FastAnimationState 实例代表播放的动画， 可以对单个动画的播放进行最细致的调节。
     * @see dragonBones.Animation
     * @see dragonBones.AnimationData
     * @example
       <pre>
        //获取动画数据
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");
      
        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
      
        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[0].name;
        //从工厂里创建出Armature
        var armature:dragonBones.FastArmature = factory.buildFastArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        //把它添加到舞台上
        this.addChild(armatureDisplay);
        
        //以60fps的帧率开启动画缓存，缓存所有的动画数据
        var animationCachManager:dragonBones.AnimationCacheManager = armature.enableAnimationCache(60);
      
       //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName = armature.animation.animationList[0];
        //播放这个动画，gotoAndPlay各个参数说明
        //第一个参数 animationName {string} 指定播放动画的名称.
        //第二个参数 fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
        //第三个参数 duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
        //第四个参数 layTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
        armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);
      
        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
       </pre>
     */
    var FastAnimationState = (function () {
        function FastAnimationState() {
            this._boneTimelineStateList = [];
            this._slotTimelineStateList = [];
            this._currentFrameIndex = 0;
            this._currentFramePosition = 0;
            this._currentFrameDuration = 0;
            this._currentPlayTimes = 0;
            this._totalTime = 0; //毫秒
            this._currentTime = 0;
            this._lastTime = 0;
            this._playTimes = 0;
            this._fading = false;
        }
        FastAnimationState.prototype.dispose = function () {
            this._resetTimelineStateList();
            this._armature = null;
        };
        /**
         * 播放当前动画。如果动画已经播放完毕, 将不会继续播放.
         * @returns {FastAnimationState} 动画播放状态实例
         */
        FastAnimationState.prototype.play = function () {
            this._isPlaying = true;
            return this;
        };
        /**
         * 暂停当前动画的播放。
         * @returns {AnimationState} 动画播放状态实例
         */
        FastAnimationState.prototype.stop = function () {
            this._isPlaying = false;
            return this;
        };
        FastAnimationState.prototype.setCurrentTime = function (value) {
            if (value < 0 || isNaN(value)) {
                value = 0;
            }
            this._time = value;
            this._currentTime = this._time * 1000;
            return this;
        };
        FastAnimationState.prototype._resetTimelineStateList = function () {
            var i = this._boneTimelineStateList.length;
            while (i--) {
                dragonBones.FastBoneTimelineState.returnObject(this._boneTimelineStateList[i]);
            }
            this._boneTimelineStateList.length = 0;
            i = this._slotTimelineStateList.length;
            while (i--) {
                dragonBones.FastSlotTimelineState.returnObject(this._slotTimelineStateList[i]);
            }
            this._slotTimelineStateList.length = 0;
            this.name = null;
        };
        /** @private */
        FastAnimationState.prototype._fadeIn = function (aniData, playTimes, timeScale, fadeTotalTime) {
            this.animationData = aniData;
            this.name = this.animationData.name;
            this._totalTime = this.animationData.duration;
            this.autoTween = aniData.autoTween;
            this.setTimeScale(timeScale);
            this.setPlayTimes(playTimes);
            //reset
            this._isComplete = false;
            this._currentFrameIndex = -1;
            this._currentPlayTimes = -1;
            if (Math.round(this._totalTime * this.animationData.frameRate * 0.001) < 2) {
                this._currentTime = this._totalTime;
            }
            else {
                this._currentTime = -1;
            }
            this._fadeTotalTime = fadeTotalTime * this._timeScale;
            this._fading = this._fadeTotalTime > 0;
            //default
            this._isPlaying = true;
            if (this._armature.enableCache && this.animationCache && this._fading && this._boneTimelineStateList) {
                this.updateTransformTimeline(this.progress);
            }
            this._time = 0;
            this._progress = 0;
            this._updateTimelineStateList();
            this.hideBones();
            return;
        };
        /**
         * @private
         * Update timeline state based on mixing transforms and clip.
         */
        FastAnimationState.prototype._updateTimelineStateList = function () {
            this._resetTimelineStateList();
            var timelineName;
            var length = this.animationData.timelineList.length;
            for (var i = 0; i < length; i++) {
                var boneTimeline = this.animationData.timelineList[i];
                timelineName = boneTimeline.name;
                var bone = this._armature.getBone(timelineName);
                if (bone) {
                    var boneTimelineState = dragonBones.FastBoneTimelineState.borrowObject();
                    boneTimelineState.fadeIn(bone, this, boneTimeline);
                    this._boneTimelineStateList.push(boneTimelineState);
                }
            }
            var length1 = this.animationData.slotTimelineList.length;
            for (var i1 = 0; i1 < length1; i1++) {
                var slotTimeline = this.animationData.slotTimelineList[i1];
                timelineName = slotTimeline.name;
                var slot = this._armature.getSlot(timelineName);
                if (slot && slot.displayList.length > 0) {
                    var slotTimelineState = dragonBones.FastSlotTimelineState.borrowObject();
                    slotTimelineState.fadeIn(slot, this, slotTimeline);
                    this._slotTimelineStateList.push(slotTimelineState);
                }
            }
        };
        /** @private */
        FastAnimationState.prototype._advanceTime = function (passedTime) {
            passedTime *= this._timeScale;
            if (this._fading) {
                //计算progress
                this._time += passedTime;
                this._progress = this._time / this._fadeTotalTime;
                if (this._progress >= 1) {
                    this._progress = 0;
                    this._time = 0;
                    this._fading = false;
                }
            }
            if (this._fading) {
                //update boneTimelie
                var length = this._boneTimelineStateList.length;
                for (var i = 0; i < length; i++) {
                    var timeline = this._boneTimelineStateList[i];
                    timeline.updateFade(this.progress);
                }
                //update slotTimelie
                var length1 = this._slotTimelineStateList.length;
                for (var i1 = 0; i1 < length1; i1++) {
                    var slotTimeline = this._slotTimelineStateList[i1];
                    slotTimeline.updateFade(this.progress);
                }
            }
            else {
                this.advanceTimelinesTime(passedTime);
            }
        };
        FastAnimationState.prototype.advanceTimelinesTime = function (passedTime) {
            this._time += passedTime;
            //计算是否已经播放完成isThisComplete
            var startFlg = false;
            var loopCompleteFlg = false;
            var completeFlg = false;
            var isThisComplete = false;
            var currentPlayTimes = 0;
            var currentTime = this._time * 1000;
            if (this._playTimes == 0 ||
                currentTime < this._playTimes * this._totalTime) {
                isThisComplete = false;
                this._progress = currentTime / this._totalTime;
                currentPlayTimes = Math.ceil(this.progress) || 1;
                this._progress -= Math.floor(this.progress);
                currentTime %= this._totalTime;
            }
            else {
                currentPlayTimes = this._playTimes;
                currentTime = this._totalTime;
                isThisComplete = true;
                this._progress = 1;
            }
            this._isComplete = isThisComplete;
            if (this.isUseCache()) {
                this.animationCache.update(this.progress);
            }
            else {
                this.updateTransformTimeline(this.progress);
            }
            //update main timeline
            if (this._currentTime != currentTime) {
                if (this._currentPlayTimes != currentPlayTimes) {
                    if (this._currentPlayTimes > 0 && currentPlayTimes > 1) {
                        loopCompleteFlg = true;
                    }
                    this._currentPlayTimes = currentPlayTimes;
                }
                if (this._currentTime < 0) {
                    startFlg = true;
                }
                if (this._isComplete) {
                    completeFlg = true;
                }
                this._lastTime = this._currentTime;
                this._currentTime = currentTime;
                this.updateMainTimeline(isThisComplete);
            }
            //抛事件
            var event;
            if (startFlg) {
                if (this._armature.hasEventListener(dragonBones.AnimationEvent.START)) {
                    event = new dragonBones.AnimationEvent(dragonBones.AnimationEvent.START);
                    event.animationState = this;
                    this._armature._addEvent(event);
                }
            }
            if (completeFlg) {
                if (this._armature.hasEventListener(dragonBones.AnimationEvent.COMPLETE)) {
                    event = new dragonBones.AnimationEvent(dragonBones.AnimationEvent.COMPLETE);
                    event.animationState = this;
                    this._armature._addEvent(event);
                }
            }
            else if (loopCompleteFlg) {
                if (this._armature.hasEventListener(dragonBones.AnimationEvent.LOOP_COMPLETE)) {
                    event = new dragonBones.AnimationEvent(dragonBones.AnimationEvent.LOOP_COMPLETE);
                    event.animationState = this;
                    this._armature._addEvent(event);
                }
            }
        };
        FastAnimationState.prototype.updateTransformTimeline = function (progress) {
            var i = this._boneTimelineStateList.length;
            var boneTimeline;
            var slotTimeline;
            if (this._isComplete) {
                //update boneTimelie
                while (i--) {
                    boneTimeline = this._boneTimelineStateList[i];
                    boneTimeline.update(progress);
                    this._isComplete = boneTimeline._isComplete && this._isComplete;
                }
                i = this._slotTimelineStateList.length;
                //update slotTimelie
                while (i--) {
                    slotTimeline = this._slotTimelineStateList[i];
                    slotTimeline.update(progress);
                    this._isComplete = slotTimeline._isComplete && this._isComplete;
                }
            }
            else {
                //update boneTimelie
                while (i--) {
                    boneTimeline = this._boneTimelineStateList[i];
                    boneTimeline.update(progress);
                }
                i = this._slotTimelineStateList.length;
                //update slotTimelie
                while (i--) {
                    slotTimeline = this._slotTimelineStateList[i];
                    slotTimeline.update(progress);
                }
            }
        };
        FastAnimationState.prototype.updateMainTimeline = function (isThisComplete) {
            var frameList = this.animationData.frameList;
            if (frameList.length > 0) {
                var prevFrame;
                var currentFrame;
                for (var i = 0, l = this.animationData.frameList.length; i < l; ++i) {
                    if (this._currentFrameIndex < 0) {
                        this._currentFrameIndex = 0;
                    }
                    else if (this._currentTime < this._currentFramePosition || this._currentTime >= this._currentFramePosition + this._currentFrameDuration || this._currentTime < this._lastTime) {
                        this._lastTime = this._currentTime;
                        this._currentFrameIndex++;
                        if (this._currentFrameIndex >= frameList.length) {
                            if (isThisComplete) {
                                this._currentFrameIndex--;
                                break;
                            }
                            else {
                                this._currentFrameIndex = 0;
                            }
                        }
                    }
                    else {
                        break;
                    }
                    currentFrame = frameList[this._currentFrameIndex];
                    if (prevFrame) {
                        this._armature.arriveAtFrame(prevFrame, this);
                    }
                    this._currentFrameDuration = currentFrame.duration;
                    this._currentFramePosition = currentFrame.position;
                    prevFrame = currentFrame;
                }
                if (currentFrame) {
                    this._armature.arriveAtFrame(currentFrame, this);
                }
            }
        };
        FastAnimationState.prototype.setTimeScale = function (value) {
            if (isNaN(value) || value == Infinity) {
                value = 1;
            }
            this._timeScale = value;
            return this;
        };
        FastAnimationState.prototype.setPlayTimes = function (value) {
            if (value === void 0) { value = 0; }
            //如果动画只有一帧  播放一次就可以
            if (Math.round(this._totalTime * 0.001 * this.animationData.frameRate) < 2) {
                this._playTimes = 1;
            }
            else {
                this._playTimes = value;
            }
            return this;
        };
        Object.defineProperty(FastAnimationState.prototype, "playTimes", {
            /**
             * 播放次数 (0:循环播放， >0:播放次数)
             * @member {number} dragonBones.FastAnimationState#playTimes
             */
            get: function () {
                return this._playTimes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastAnimationState.prototype, "currentPlayTimes", {
            /**
             * 当前播放次数
             * @member {number} dragonBones.FastAnimationState#currentPlayTimes
             */
            get: function () {
                return this._currentPlayTimes < 0 ? 0 : this._currentPlayTimes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastAnimationState.prototype, "isComplete", {
            /**
             * 是否播放完成
             * @member {boolean} dragonBones.FastAnimationState#isComplete
             */
            get: function () {
                return this._isComplete;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastAnimationState.prototype, "isPlaying", {
            /**
             * 是否正在播放
             * @member {boolean} dragonBones.FastAnimationState#isPlaying
             */
            get: function () {
                return (this._isPlaying && !this._isComplete);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastAnimationState.prototype, "totalTime", {
            /**
             * 动画总时长（单位：秒）
             * @member {number} dragonBones.FastAnimationState#totalTime
             */
            get: function () {
                return this._totalTime * 0.001;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastAnimationState.prototype, "currentTime", {
            /**
             * 动画当前播放时间（单位：秒）
             * @member {number} dragonBones.FastAnimationState#currentTime
             */
            get: function () {
                return this._currentTime < 0 ? 0 : this._currentTime * 0.001;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 是否使用缓存
         * @member {boolean} dragonBones.FastAnimationState#isUseCache
         */
        FastAnimationState.prototype.isUseCache = function () {
            return this._armature.enableCache && this.animationCache && !this._fading;
        };
        FastAnimationState.prototype.hideBones = function () {
            var length = this.animationData.hideTimelineNameMap.length;
            for (var i = 0; i < length; i++) {
                var timelineName = this.animationData.hideTimelineNameMap[i];
                var bone = this._armature.getBone(timelineName);
                if (bone) {
                    bone._hideSlots();
                }
            }
            var slotTimelineName;
            for (i = 0, length = this.animationData.hideSlotTimelineNameMap.length; i < length; i++) {
                slotTimelineName = this.animationData.hideSlotTimelineNameMap[i];
                var slot = this._armature.getSlot(slotTimelineName);
                if (slot) {
                    slot._resetToOrigin();
                }
            }
        };
        Object.defineProperty(FastAnimationState.prototype, "progress", {
            /**
             * 动画播放进度
             * @member {number} dragonBones.FastAnimationState#progress
             */
            get: function () {
                return this._progress;
            },
            enumerable: true,
            configurable: true
        });
        return FastAnimationState;
    })();
    dragonBones.FastAnimationState = FastAnimationState;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.FastAnimation
     * @classdesc
     * FastAnimation实例隶属于FastArmature,用于控制FastArmature的动画播放。
     * 和Animation相比，FastAnimation为了优化性能，不支持动画融合，在开启缓存的情况下，不支持无极的平滑补间
     * @see dragonBones.FastBone
     * @see dragonBones.FastArmature
     * @see dragonBones.FastAnimationState
     * @see dragonBones.AnimationData.
     *
     * @example
       <pre>
        //获取动画数据
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");
      
        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
      
        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[0].name;
        //从工厂里创建出Armature
        var armature:dragonBones.FastArmature = factory.buildFastArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        //把它添加到舞台上
        this.addChild(armatureDisplay);
        
        //以60fps的帧率开启动画缓存，缓存所有的动画数据
        var animationCachManager:dragonBones.AnimationCacheManager = armature.enableAnimationCache(60);
      
       //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName = armature.animation.animationList[0];
        //播放这个动画，gotoAndPlay各个参数说明
        //第一个参数 animationName {string} 指定播放动画的名称.
        //第二个参数 fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
        //第三个参数 duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
        //第四个参数 layTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
        armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);
      
        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
       </pre>
     */
    var FastAnimation = (function () {
        /**
         * 创建一个新的FastAnimation实例并赋给传入的FastArmature实例
         * @param armature {FastArmature} 骨架实例
         */
        function FastAnimation(armature) {
            /**
             * 当前正在运行的动画实例.
             * @member {FastAnimationState} dragonBones.FastAnimation#animationState
             */
            this.animationState = new dragonBones.FastAnimationState();
            this._armature = armature;
            this.animationState._armature = armature;
            this.animationList = [];
            this._animationDataObj = {};
            this._isPlaying = false;
            this._timeScale = 1;
        }
        /**
         * Qualifies all resources used by this Animation instance for garbage collection.
         */
        FastAnimation.prototype.dispose = function () {
            if (!this._armature) {
                return;
            }
            this._armature = null;
            this._animationDataList = null;
            this.animationList = null;
            this.animationState = null;
        };
        /**
         * 开始播放指定名称的动画。
         * 要播放的动画将经过指定时间的淡入过程，然后开始播放，同时之前播放的动画会经过相同时间的淡出过程。
         * @param animationName {string} 指定播放动画的名称.
         * @param fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
         * @param duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
         * @param playTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
         * @see dragonBones.FastAnimationState.
         */
        FastAnimation.prototype.gotoAndPlay = function (animationName, fadeInTime, duration, playTimes) {
            if (fadeInTime === void 0) { fadeInTime = -1; }
            if (duration === void 0) { duration = -1; }
            if (playTimes === void 0) { playTimes = NaN; }
            if (!this._animationDataList) {
                return null;
            }
            var animationData = this._animationDataObj[animationName];
            if (!animationData) {
                return null;
            }
			var needUpdate = this._isPlaying == false;
            this._isPlaying = true;
            this._isFading = true;
            //
            fadeInTime = fadeInTime < 0 ? (animationData.fadeTime < 0 ? 0.3 : animationData.fadeTime) : fadeInTime;

            var durationScale;
            if (duration < 0) {
                durationScale = animationData.scale < 0 ? 1 : animationData.scale;
            }
            else {
                durationScale = duration * 1000 / animationData.duration;
            }
            playTimes = isNaN(playTimes) ? animationData.playTimes : playTimes;
            //播放新动画
            this.animationState._fadeIn(animationData, playTimes, 1 / durationScale, fadeInTime);
            if (this._armature.enableCache && this.animationCacheManager) {
                this.animationState.animationCache = this.animationCacheManager.getAnimationCache(animationName);
            }
            var i = this._armature.slotHasChildArmatureList.length;
            while (i--) {
                var slot = this._armature.slotHasChildArmatureList[i];
                var childArmature = slot.childArmature;
                if (childArmature) {
                    childArmature.getAnimation().gotoAndPlay(animationName);
                }
            }
            return this.animationState;
        };
        /**
         * 播放指定名称的动画并停止于某个时间点
         * @param animationName {string} 指定播放的动画名称.
         * @param time {number} 动画停止的绝对时间
         * @param normalizedTime {number} 动画停止的相对动画总时间的系数，这个参数和time参数是互斥的（例如 0.2：动画停止总时间的20%位置） 默认值：-1 意味着使用绝对时间。
         * @param fadeInTime {number} 动画淡入时间 (>= 0), 默认值：0
         * @param duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
         * @see dragonBones.FastAnimationState.
         */
        FastAnimation.prototype.gotoAndStop = function (animationName, time, normalizedTime, fadeInTime, duration) {
            if (normalizedTime === void 0) { normalizedTime = -1; }
            if (fadeInTime === void 0) { fadeInTime = 0; }
            if (duration === void 0) { duration = -1; }
            if (this.animationState.name != animationName) {
                this.gotoAndPlay(animationName, fadeInTime, duration);
            }
            if (normalizedTime >= 0) {
                this.animationState.setCurrentTime(this.animationState.totalTime * normalizedTime);
            }
            else {
                this.animationState.setCurrentTime(time);
            }
            this.animationState.stop();
            return this.animationState;
        };
        /**
         * 从当前位置继续播放动画
         */
        FastAnimation.prototype.play = function () {
            if (!this._animationDataList) {
                return;
            }
            if (!this.animationState.name) {
                this.gotoAndPlay(this._animationDataList[0].name);
            }
            else if (!this._isPlaying) {
                this._isPlaying = true;
            }
            else {
                this.gotoAndPlay(this.animationState.name);
            }
        };
        /**
         * 暂停动画播放
         */
        FastAnimation.prototype.stop = function () {
            this._isPlaying = false;
        };
        /** @private */
        FastAnimation.prototype.advanceTime = function (passedTime) {
            if (!this._isPlaying) {
                return;
            }
            this.animationState._advanceTime(passedTime * this._timeScale);
        };
        /**
         * check if contains a AnimationData by name.
         * @return Boolean.
         * @see dragonBones.animation.AnimationData.
         */
        FastAnimation.prototype.hasAnimation = function (animationName) {
            return this._animationDataObj[animationName] != null;
        };
        Object.defineProperty(FastAnimation.prototype, "timeScale", {
            /**
             * 时间缩放倍数
             * @member {number} dragonBones.FastAnimation#timeScale
             */
            get: function () {
                return this._timeScale;
            },
            set: function (value) {
                if (isNaN(value) || value < 0) {
                    value = 1;
                }
                this._timeScale = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastAnimation.prototype, "animationDataList", {
            /**
             * 包含的所有动画数据列表
             * @member {AnimationData[]} dragonBones.FastAnimation#animationDataList
             * @see dragonBones.AnimationData.
             */
            get: function () {
                return this._animationDataList;
            },
            set: function (value) {
                this._animationDataList = value;
                this.animationList.length = 0;
                var length = this._animationDataList.length;
                for (var i = 0; i < length; i++) {
                    var animationData = this._animationDataList[i];
                    this.animationList.push(animationData.name);
                    this._animationDataObj[animationData.name] = animationData;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastAnimation.prototype, "movementList", {
            /**
             * Unrecommended API. Recommend use animationList.
             */
            get: function () {
                return this.animationList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastAnimation.prototype, "movementID", {
            /**
             * Unrecommended API. Recommend use lastAnimationName.
             */
            get: function () {
                return this.lastAnimationName;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 是否正在播放
         * @member {boolean} dragonBones.FastAnimation#isPlaying
         */
        FastAnimation.prototype.isPlaying = function () {
            return this._isPlaying && !this.isComplete;
        };
        Object.defineProperty(FastAnimation.prototype, "isComplete", {
            /**
             * 是否播放完成.
             * @member {boolean} dragonBones.FastAnimation#isComplete
             */
            get: function () {
                return this.animationState.isComplete;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastAnimation.prototype, "lastAnimationState", {
            /**
             * 当前播放动画的实例.
             * @member {FastAnimationState} dragonBones.FastAnimation#lastAnimationState
             */
            get: function () {
                return this.animationState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastAnimation.prototype, "lastAnimationName", {
            /**
             * 当前播放动画的名字.
             * @member {string} dragonBones.FastAnimation#lastAnimationName
             */
            get: function () {
                return this.animationState ? this.animationState.name : null;
            },
            enumerable: true,
            configurable: true
        });
        return FastAnimation;
    })();
    dragonBones.FastAnimation = FastAnimation;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.FastDBObject
     * @classdesc
     * FastDBObject 是 FastBone 和 FastSlot 的基类
     * @see dragonBones.FastBone
     * @see dragonBones.FastSlot
     */
    var FastDBObject = (function () {
        function FastDBObject() {
            this._globalTransformMatrix = new dragonBones.Matrix();
            this._global = new dragonBones.DBTransform();
            this._origin = new dragonBones.DBTransform();
            this._visible = true;
            this.armature = null;
            this._parent = null;
            this.userData = null;
            this.inheritRotation = true;
            this.inheritScale = true;
            this.inheritTranslation = true;
        }
        /** @private */
        FastDBObject.prototype.updateByCache = function () {
            this._global = this._frameCache.globalTransform;
            this._globalTransformMatrix = this._frameCache.globalTransformMatrix;
        };
        /** @private */
        FastDBObject.prototype.switchTransformToBackup = function () {
            if (!this._globalBackup) {
                this._globalBackup = new dragonBones.DBTransform();
                this._globalTransformMatrixBackup = new dragonBones.Matrix();
            }
            this._global = this._globalBackup;
            this._globalTransformMatrix = this._globalTransformMatrixBackup;
        };
        /** @private */
        FastDBObject.prototype.setParent = function (value) {
            this._parent = value;
        };
        /**
         * Cleans up any resources used by this DBObject instance.
         */
        FastDBObject.prototype.dispose = function () {
            this.userData = null;
            this._globalTransformMatrix = null;
            this._global = null;
            this._origin = null;
            this.armature = null;
            this._parent = null;
        };
        FastDBObject.prototype._calculateParentTransform = function () {
            if (this.parent && (this.inheritTranslation || this.inheritRotation || this.inheritScale)) {
                var parentGlobalTransform = this._parent._global;
                var parentGlobalTransformMatrix = this._parent._globalTransformMatrix;
                if (!this.inheritTranslation && (parentGlobalTransform.x != 0 || parentGlobalTransform.y != 0) ||
                    !this.inheritRotation && (parentGlobalTransform.skewX != 0 || parentGlobalTransform.skewY != 0) ||
                    !this.inheritScale && (parentGlobalTransform.scaleX != 1 || parentGlobalTransform.scaleY != 1)) {
                    parentGlobalTransform = FastDBObject._tempParentGlobalTransform;
                    parentGlobalTransform.copy(this._parent._global);
                    if (!this.inheritTranslation) {
                        parentGlobalTransform.x = 0;
                        parentGlobalTransform.y = 0;
                    }
                    if (!this.inheritScale) {
                        parentGlobalTransform.scaleX = 1;
                        parentGlobalTransform.scaleY = 1;
                    }
                    if (!this.inheritRotation) {
                        parentGlobalTransform.skewX = 0;
                        parentGlobalTransform.skewY = 0;
                    }
                    parentGlobalTransformMatrix = dragonBones.DBObject._tempParentGlobalTransformMatrix;
                    dragonBones.TransformUtil.transformToMatrix(parentGlobalTransform, parentGlobalTransformMatrix);
                }
                FastDBObject.tempOutputObj.parentGlobalTransform = parentGlobalTransform;
                FastDBObject.tempOutputObj.parentGlobalTransformMatrix = parentGlobalTransformMatrix;
                return FastDBObject.tempOutputObj;
            }
            return null;
        };
        FastDBObject.prototype._updateGlobal = function () {
            this._calculateRelativeParentTransform();
            var output = this._calculateParentTransform();
            if (output != null) {
                //计算父骨头绝对坐标
                var parentMatrix = output.parentGlobalTransformMatrix;
                var parentGlobalTransform = output.parentGlobalTransform;
                //计算绝对坐标
                var x = this._global.x;
                var y = this._global.y;
                this._global.x = parentMatrix.a * x + parentMatrix.c * y + parentMatrix.tx;
                this._global.y = parentMatrix.d * y + parentMatrix.b * x + parentMatrix.ty;
                if (this.inheritRotation) {
                    this._global.skewX += parentGlobalTransform.skewX;
                    this._global.skewY += parentGlobalTransform.skewY;
                }
                if (this.inheritScale) {
                    this._global.scaleX *= parentGlobalTransform.scaleX;
                    this._global.scaleY *= parentGlobalTransform.scaleY;
                }
            }
            dragonBones.TransformUtil.transformToMatrix(this._global, this._globalTransformMatrix, true);
            return output;
        };
        FastDBObject.prototype._calculateRelativeParentTransform = function () {
        };
        Object.defineProperty(FastDBObject.prototype, "name", {
            get: function () {
                return this._name;
            },
            set: function (value) {
                this._name = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastDBObject.prototype, "global", {
            /**
             * This DBObject instance global transform instance.
             * @see dragonBones.objects.DBTransform
             */
            get: function () {
                return this._global;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastDBObject.prototype, "globalTransformMatrix", {
            get: function () {
                return this._globalTransformMatrix;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastDBObject.prototype, "origin", {
            /**
             * This DBObject instance related to parent transform instance.
             * @see dragonBones.objects.DBTransform
             */
            get: function () {
                return this._origin;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastDBObject.prototype, "parent", {
            /**
             * Indicates the Bone instance that directly contains this DBObject instance if any.
             */
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastDBObject.prototype, "visible", {
            get: function () {
                return this._visible;
            },
            set: function (value) {
                this._visible = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastDBObject.prototype, "frameCache", {
            set: function (cache) {
                this._frameCache = cache;
            },
            enumerable: true,
            configurable: true
        });
        FastDBObject._tempParentGlobalTransform = new dragonBones.DBTransform();
        FastDBObject.tempOutputObj = {};
        return FastDBObject;
    })();
    dragonBones.FastDBObject = FastDBObject;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////

var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.FastSlot
     * @classdesc
     * FastSlot 实例是骨头上的一个插槽，是显示图片的容器。
     * 一个 FastBone 上可以有多个FastSlot，每个FastSlot中同一时间都会有一张图片用于显示，不同的FastSlot中的图片可以同时显示。
     * 每个 FastSlot 中可以包含多张图片，同一个 FastSlot 中的不同图片不能同时显示，但是可以在动画进行的过程中切换，用于实现帧动画。
     * @extends dragonBones.DBObject
     * @see dragonBones.FastArmature
     * @see dragonBones.FastBone
     * @see dragonBones.SlotData
     */
    var FastSlot = (function (_super) {
        __extends(FastSlot, _super);
        function FastSlot(self) {
            _super.call(this);
            this._currentDisplayIndex = 0;
            if (self != this) {
                throw new Error("Abstract class can not be instantiated!");
            }
            this.hasChildArmature = false;
            this._currentDisplayIndex = -1;
            this._originZOrder = 0;
            this._tweenZOrder = 0;
            this._offsetZOrder = 0;
            this._colorTransform = new dragonBones.ColorTransform();
            this._isColorChanged = false;
            this._displayDataList = null;
            this._currentDisplay = null;
            this.inheritRotation = true;
            this.inheritScale = true;
        }
        /**
         * 通过传入 SlotData 初始化FastSlot
         * @param slotData
         */
        FastSlot.prototype.initWithSlotData = function (slotData) {
            this.name = slotData.name;
            this.blendMode = slotData.blendMode;
            this._originZOrder = slotData.zOrder;
            this._displayDataList = slotData.displayDataList;
            this._originDisplayIndex = slotData.displayIndex;
        };
        /**
         * @inheritDoc
         */
        FastSlot.prototype.dispose = function () {
            if (!this._displayList) {
                return;
            }
            _super.prototype.dispose.call(this);
            this._displayDataList = null;
            this._displayList = null;
            this._currentDisplay = null;
        };
        //动画
        /** @private */
        FastSlot.prototype.updateByCache = function () {
            _super.prototype.updateByCache.call(this);
            this._updateTransform();
            //颜色
            var cacheColor = (this._frameCache).colorTransform;
            var cacheColorChanged = cacheColor != null;
            if (this.colorChanged != cacheColorChanged ||
                (this.colorChanged && cacheColorChanged && !dragonBones.ColorTransformUtil.isEqual(this._colorTransform, cacheColor))) {
                cacheColor = cacheColor || dragonBones.ColorTransformUtil.originalColor;
                this._updateDisplayColor(cacheColor.alphaOffset, cacheColor.redOffset, cacheColor.greenOffset, cacheColor.blueOffset, cacheColor.alphaMultiplier, cacheColor.redMultiplier, cacheColor.greenMultiplier, cacheColor.blueMultiplier, cacheColorChanged);
            }
            //displayIndex
            this._changeDisplayIndex((this._frameCache).displayIndex);
        };
        /** @private */
        FastSlot.prototype._update = function () {
            if (this._parent._needUpdate <= 0) {
                return;
            }
            this._updateGlobal();
            this._updateTransform();
        };
        FastSlot.prototype._calculateRelativeParentTransform = function () {
            this._global.copy(this._origin);
        };
        FastSlot.prototype.initDisplayList = function (newDisplayList) {
            this._displayList = newDisplayList;
        };
        FastSlot.prototype.clearCurrentDisplay = function () {
            if (this.hasChildArmature) {
                var targetArmature = this.childArmature;
                if (targetArmature) {
                    targetArmature.resetAnimation();
                }
            }
            var slotIndex = this._getDisplayIndex();
            this._removeDisplayFromContainer();
            return slotIndex;
        };
        /** @private */
        FastSlot.prototype._changeDisplayIndex = function (displayIndex) {
            if (displayIndex === void 0) { displayIndex = 0; }
            if (this._currentDisplayIndex == displayIndex) {
                return;
            }
            var slotIndex = -1;
            if (this._currentDisplayIndex >= 0) {
                slotIndex = this.clearCurrentDisplay();
            }
            this._currentDisplayIndex = displayIndex;
            if (this._currentDisplayIndex >= 0) {
                this._origin.copy(this._displayDataList[this._currentDisplayIndex].transform);
                this.initCurrentDisplay(slotIndex);
            }
        };
        //currentDisplayIndex不变，改变内容，必须currentDisplayIndex >=0
        FastSlot.prototype.changeSlotDisplay = function (value) {
            var slotIndex = this.clearCurrentDisplay();
            this._displayList[this._currentDisplayIndex] = value;
            this.initCurrentDisplay(slotIndex);
        };
        FastSlot.prototype.initCurrentDisplay = function (slotIndex) {
            if (slotIndex === void 0) { slotIndex = 0; }
            var display = this._displayList[this._currentDisplayIndex];
            if (display) {
                if (display instanceof dragonBones.FastArmature) {
                    this._currentDisplay = display.display;
                }
                else {
                    this._currentDisplay = display;
                }
            }
            else {
                this._currentDisplay = null;
            }
            this._updateDisplay(this._currentDisplay);
            if (this._currentDisplay) {
                if (slotIndex != -1) {
                    this._addDisplayToContainer(this.armature.display, slotIndex);
                }
                else {
                    this.armature._slotsZOrderChanged = true;
                    this._addDisplayToContainer(this.armature.display);
                }
                if (this._blendMode) {
                    this._updateDisplayBlendMode(this._blendMode);
                }
                if (this._isColorChanged) {
                    this._updateDisplayColor(this._colorTransform.alphaOffset, this._colorTransform.redOffset, this._colorTransform.greenOffset, this._colorTransform.blueOffset, this._colorTransform.alphaMultiplier, this._colorTransform.redMultiplier, this._colorTransform.greenMultiplier, this._colorTransform.blueMultiplier, true);
                }
                this._updateTransform();
                if (display instanceof dragonBones.FastArmature) {
                    var targetArmature = (display);
                    if (this.armature &&
                        this.armature.animation.animationState &&
                        targetArmature.animation.hasAnimation(this.armature.animation.animationState.name)) {
                        targetArmature.animation.gotoAndPlay(this.armature.animation.animationState.name);
                    }
                    else {
                        targetArmature.animation.play();
                    }
                }
            }
        };
        Object.defineProperty(FastSlot.prototype, "visible", {
            /** @private */
            set: function (value) {
                if (this._visible != value) {
                    this._visible = value;
                    this._updateDisplayVisible(this._visible);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastSlot.prototype, "displayList", {
            /**
             * 显示对象列表(包含 display 或者 子骨架)
             * @member {any[]} dragonBones.FastSlot#displayList
             */
            get: function () {
                return this._displayList;
            },
            set: function (value) {
                //todo: 考虑子骨架变化的各种情况
                if (!value) {
                    throw new Error();
                }
                var newDisplay = value[this._currentDisplayIndex];
                var displayChanged = this._currentDisplayIndex >= 0 && this._displayList[this._currentDisplayIndex] != newDisplay;
                this._displayList = value;
                if (displayChanged) {
                    this.changeSlotDisplay(newDisplay);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastSlot.prototype, "display", {
            /**
             * 当前的显示对象(可能是 display 或者 子骨架)
             * @member {any} dragonBones.FastSlot#display
             */
            get: function () {
                return this._currentDisplay;
            },
            set: function (value) {
                //todo: 考虑子骨架变化的各种情况
                if (this._currentDisplayIndex < 0) {
                    return;
                }
                if (this._displayList[this._currentDisplayIndex] == value) {
                    return;
                }
                this.changeSlotDisplay(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastSlot.prototype, "childArmature", {
            /**
             * 当前的子骨架
             * @member {FastArmature} dragonBones.Slot#childArmature
             */
            get: function () {
                return (this._displayList[this._currentDisplayIndex] instanceof dragonBones.Armature
                    || this._displayList[this._currentDisplayIndex] instanceof dragonBones.FastArmature) ? this._displayList[this._currentDisplayIndex] : null;
            },
            set: function (value) {
                this.display = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastSlot.prototype, "zOrder", {
            /**
             * 显示顺序。(支持小数用于实现动态插入slot)
             * @member {number} dragonBones.FastSlot#zOrder
             */
            get: function () {
                return this._originZOrder + this._tweenZOrder + this._offsetZOrder;
            },
            set: function (value) {
                if (this.zOrder != value) {
                    this._offsetZOrder = value - this._originZOrder - this._tweenZOrder;
                    if (this.armature) {
                        this.armature._slotsZOrderChanged = true;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastSlot.prototype, "blendMode", {
            /**
             * 混合模式
             * @member {string} dragonBones.FastSlot#blendMode
             */
            get: function () {
                return this._blendMode;
            },
            set: function (value) {
                if (this._blendMode != value) {
                    this._blendMode = value;
                    this._updateDisplayBlendMode(this._blendMode);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastSlot.prototype, "colorTransform", {
            /**
             * Indicates the Bone instance that directly contains this DBObject instance if any.
             */
            get: function () {
                return this._colorTransform;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastSlot.prototype, "displayIndex", {
            get: function () {
                return this._currentDisplayIndex;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastSlot.prototype, "colorChanged", {
            get: function () {
                return this._isColorChanged;
            },
            enumerable: true,
            configurable: true
        });
        //Abstract method
        /**
         * @private
         */
        FastSlot.prototype._updateDisplay = function (value) {
            throw new Error("Abstract method needs to be implemented in subclass!");
        };
        /**
         * @private
         */
        FastSlot.prototype._getDisplayIndex = function () {
            throw new Error("Abstract method needs to be implemented in subclass!");
        };
        /**
         * @private
         * Adds the original display object to another display object.
         * @param container
         * @param index
         */
        FastSlot.prototype._addDisplayToContainer = function (container, index) {
            if (index === void 0) { index = -1; }
            throw new Error("Abstract method needs to be implemented in subclass!");
        };
        /**
         * @private
         * remove the original display object from its parent.
         */
        FastSlot.prototype._removeDisplayFromContainer = function () {
            throw new Error("Abstract method needs to be implemented in subclass!");
        };
        /**
         * @private
         * Updates the transform of the slot.
         */
        FastSlot.prototype._updateTransform = function () {
            throw new Error("Abstract method needs to be implemented in subclass!");
        };
        /**
         * @private
         */
        FastSlot.prototype._updateDisplayVisible = function (value) {
            /**
             * bone.visible && slot.visible && updateVisible
             * this._parent.visible && this._visible && value;
             */
            throw new Error("Abstract method needs to be implemented in subclass!");
        };
        /**
         * @private
         * Updates the color of the display object.
         * @param a
         * @param r
         * @param g
         * @param b
         * @param aM
         * @param rM
         * @param gM
         * @param bM
         */
        FastSlot.prototype._updateDisplayColor = function (aOffset, rOffset, gOffset, bOffset, aMultiplier, rMultiplier, gMultiplier, bMultiplier, colorChanged) {
            if (colorChanged === void 0) { colorChanged = false; }
            this._colorTransform.alphaOffset = aOffset;
            this._colorTransform.redOffset = rOffset;
            this._colorTransform.greenOffset = gOffset;
            this._colorTransform.blueOffset = bOffset;
            this._colorTransform.alphaMultiplier = aMultiplier;
            this._colorTransform.redMultiplier = rMultiplier;
            this._colorTransform.greenMultiplier = gMultiplier;
            this._colorTransform.blueMultiplier = bMultiplier;
            this._isColorChanged = colorChanged;
        };
        /**
         * @private
         * Update the blend mode of the display object.
         * @param value The blend mode to use.
         */
        FastSlot.prototype._updateDisplayBlendMode = function (value) {
            throw new Error("Abstract method needs to be implemented in subclass!");
        };
        /** @private When slot timeline enter a key frame, call this func*/
        FastSlot.prototype._arriveAtFrame = function (frame, animationState) {
            var slotFrame = frame;
            var displayIndex = slotFrame.displayIndex;
            this._changeDisplayIndex(displayIndex);
            this._updateDisplayVisible(slotFrame.visible);
            if (displayIndex >= 0) {
                if (!isNaN(slotFrame.zOrder) && slotFrame.zOrder != this._tweenZOrder) {
                    this._tweenZOrder = slotFrame.zOrder;
                    this.armature._slotsZOrderChanged = true;
                }
            }
            //[TODO]currently there is only gotoAndPlay belongs to frame action. In future, there will be more.  
            //后续会扩展更多的action，目前只有gotoAndPlay的含义
            if (frame.action) {
                var targetArmature = this.childArmature;
                if (targetArmature) {
                    targetArmature.getAnimation().gotoAndPlay(frame.action);
                }
            }
        };
        /** @private */
        FastSlot.prototype.hideSlots = function () {
            this._changeDisplayIndex(-1);
            this._removeDisplayFromContainer();
            if (this._frameCache) {
                this._frameCache.clear();
            }
        };
        FastSlot.prototype._updateGlobal = function () {
            this._calculateRelativeParentTransform();
            dragonBones.TransformUtil.transformToMatrix(this._global, this._globalTransformMatrix, true);
            var output = this._calculateParentTransform();
            if (output) {
                this._globalTransformMatrix.concat(output.parentGlobalTransformMatrix);
                dragonBones.TransformUtil.matrixToTransform(this._globalTransformMatrix, this._global, this._global.scaleX * output.parentGlobalTransform.scaleX >= 0, this._global.scaleY * output.parentGlobalTransform.scaleY >= 0);
            }
            return output;
        };
        FastSlot.prototype._resetToOrigin = function () {
            this._changeDisplayIndex(this._originDisplayIndex);
            this._updateDisplayColor(0, 0, 0, 0, 1, 1, 1, 1, true);
        };
        return FastSlot;
    })(dragonBones.FastDBObject);
    dragonBones.FastSlot = FastSlot;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.FastBone
     * @classdesc
     * FastBone 实例代表 FastArmature 中的一个骨头。一个FastArmature实例可以由很多 FastBone组成。
     * FastBone 在骨骼动画体系中是最重要的逻辑单元之一，负责动画中的平移旋转缩放的实现
     * 和Bone相比，FastBone不能动态添加子骨骼和子插槽
     * @extends dragonBones.FastDBObject
     * @see dragonBones.FastArmature
     * @see dragonBones.FastSlot
     * @see dragonBones.BoneData
     */
    var FastBone = (function (_super) {
        __extends(FastBone, _super);
        function FastBone() {
            _super.call(this);
            this.slotList = [];
            this.boneList = [];
            /** @private */
            this._needUpdate = 0;
            this._needUpdate = 2;
        }
        FastBone.initWithBoneData = function (boneData) {
            var outputBone = new FastBone();
            outputBone.name = boneData.name;
            outputBone.inheritRotation = boneData.inheritRotation;
            outputBone.inheritScale = boneData.inheritScale;
            outputBone.origin.copy(boneData.transform);
            return outputBone;
        };
        /**
         * 获取当前骨头包含的所有 FastBone 实例
         * @param returnCopy {boolean} 是否返回拷贝。默认：true
         * @returns {FastBone[]}
         */
        FastBone.prototype.getBones = function (returnCopy) {
            if (returnCopy === void 0) { returnCopy = true; }
            return returnCopy ? this.boneList.concat() : this.boneList;
        };
        /**
         * 获取当前骨头包含的所有 FastSlot 实例
         * @param returnCopy {boolean} 是否返回拷贝。默认：true
         * @returns {FastSlot[]}
         */
        FastBone.prototype.getSlots = function (returnCopy) {
            if (returnCopy === void 0) { returnCopy = true; }
            return returnCopy ? this.slotList.concat() : this.slotList;
        };
        /**
         * @inheritDoc
         */
        FastBone.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this._timelineState = null;
        };
        //动画
        /**
         * 在下一帧强制更新当前 Bone 实例及其包含的所有 Slot 的动画。
         */
        FastBone.prototype.invalidUpdate = function () {
            this._needUpdate = 2;
        };
        FastBone.prototype._calculateRelativeParentTransform = function () {
            this._global.copy(this._origin);
            if (this._timelineState) {
                this._global.add(this._timelineState._transform);
            }
        };
        /** @private */
        FastBone.prototype.updateByCache = function () {
            _super.prototype.updateByCache.call(this);
            this._global = this._frameCache.globalTransform;
            this._globalTransformMatrix = this._frameCache.globalTransformMatrix;
        };
        /** @private */
        FastBone.prototype.update = function (needUpdate) {
            if (needUpdate === void 0) { needUpdate = false; }
            this._needUpdate--;
            if (needUpdate || this._needUpdate > 0 || (this._parent && this._parent._needUpdate > 0)) {
                this._needUpdate = 1;
            }
            else {
                return;
            }
            //计算global
            this._updateGlobal();
        };
        /** @private */
        FastBone.prototype._hideSlots = function () {
            var length = this.slotList.length;
            for (var i = 0; i < length; i++) {
                var childSlot = this.slotList[i];
                childSlot.hideSlots();
            }
        };
        /** @private When bone timeline enter a key frame, call this func*/
        FastBone.prototype.arriveAtFrame = function (frame, animationState) {
            var childSlot;
            if (frame.event && this.armature.hasEventListener(dragonBones.FrameEvent.BONE_FRAME_EVENT)) {
                var frameEvent = new dragonBones.FrameEvent(dragonBones.FrameEvent.BONE_FRAME_EVENT);
                frameEvent.bone = this;
                frameEvent.animationState = animationState;
                frameEvent.frameLabel = frame.event;
                this.armature._addEvent(frameEvent);
            }
        };
        Object.defineProperty(FastBone.prototype, "childArmature", {
            /**
             * 不推荐的API,建议使用 slot.childArmature 替代
             */
            get: function () {
                var s = this.slot;
                if (s) {
                    return s.childArmature;
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastBone.prototype, "display", {
            /**
             * 不推荐的API,建议使用 slot.display 替代
             */
            get: function () {
                var s = this.slot;
                if (s) {
                    return s.display;
                }
                return null;
            },
            set: function (value) {
                var s = this.slot;
                if (s) {
                    s.display = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastBone.prototype, "visible", {
            /** @private */
            set: function (value) {
                if (this._visible != value) {
                    this._visible = value;
                    for (var i = 0, len = this.armature.slotList.length; i < len; i++) {
                        if (this.armature.slotList[i].parent == this) {
                            this.armature.slotList[i]._updateDisplayVisible(this._visible);
                        }
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastBone.prototype, "slot", {
            /**
             * 返回当前 FastBone 实例包含的第一个 FastSlot 实例
             * @member {FastSlot} dragonBones.FastBone#slot
             */
            get: function () {
                return this.slotList.length > 0 ? this.slotList[0] : null;
            },
            enumerable: true,
            configurable: true
        });
        return FastBone;
    })(dragonBones.FastDBObject);
    dragonBones.FastBone = FastBone;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.EventDispatcher
     * @classdesc
     * 事件派发者
     */
   	// function dispatcher() {}
    // var EventDispatcher = (function (_super) {
    //     __extends(EventDispatcher, _super);
    //     function EventDispatcher(target) {
    //         if (target === void 0) { target = null; }
    //         _super.call(this, target);
    //     }
    //     return EventDispatcher;
    // //})(egret.EventDispatcher);
    // })(dispatcher);
    var EventDispatcher = (function () {
        function EventDispatcher() {
        }
        EventDispatcher.prototype.hasEventListener = function (type) {
            if (this._listenersMap && this._listenersMap[type]) {
                return true;
            }
            return false;
        };

        EventDispatcher.prototype.addEventListener = function (type, listener) {
            if (type && listener) {
                if (!this._listenersMap) {
                    this._listenersMap = {};
                }
                var listeners = this._listenersMap[type];
                if (listeners) {
                    this.removeEventListener(type, listener);
                }
                if (listeners) {
                    listeners.push(listener);
                } else {
                    this._listenersMap[type] = [listener];
                }
            }
        };

        EventDispatcher.prototype.removeEventListener = function (type, listener) {
            if (!this._listenersMap || !type || !listener) {
                return;
            }
            var listeners = this._listenersMap[type];
            if (listeners) {
                var length = listeners.length;
                for (var i = 0; i < length; i++) {
                	//FIX BY LC
                    //if (listeners[i] == listener) {
                    if (listeners[i].toString() === listener.toString()) {
                        if (length == 1) {
                            listeners.length = 0;
                            //FIX BY LC
                            //delete this._listenersMap[type];
                        } else {
                            listeners.splice(i, 1);
                        }
                    }
                }
            }
        };

        EventDispatcher.prototype.removeAllEventListeners = function (type) {
            if (type) {
                delete this._listenersMap[type];
            } else {
                this._listenersMap = null;
            }
        };

        EventDispatcher.prototype.dispatchEvent = function (event) {
            if (event) {
                var listeners = this._listenersMap[event.type];
                if (listeners) {
                    event.target = this;
                    var listenersCopy = listeners.concat();
                    var length = listeners.length;
                    for (var i = 0; i < length; i++) {
                        listenersCopy[i](event);
                    }
                }
            }
        };
        return EventDispatcher;
    })();
    dragonBones.EventDispatcher = EventDispatcher;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////

var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.FastArmature
     * @classdesc
     * FastArmature 是 DragonBones 高效率的骨骼动画系统。他能缓存动画数据，大大减少动画播放的计算
     * 不支持动态添加Bone和Slot，换装请通过更换Slot的dispaly或子骨架childArmature来实现
     * @extends dragonBones.EventDispatcher
     * @see dragonBones.ArmatureData
     *
     * @example
       <pre>
        //获取动画数据
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");
      
        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
      
        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[0].name;
        //从工厂里创建出Armature
        var armature:dragonBones.FastArmature = factory.buildFastArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        //把它添加到舞台上
        this.addChild(armatureDisplay);
        
        //以60fps的帧率开启动画缓存，缓存所有的动画数据
        var animationCachManager:dragonBones.AnimationCacheManager = armature.enableAnimationCache(60);
      
       //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName = armature.animation.animationList[0];
        //播放这个动画，gotoAndPlay各个参数说明
        //第一个参数 animationName {string} 指定播放动画的名称.
        //第二个参数 fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
        //第三个参数 duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
        //第四个参数 layTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
        armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);
      
        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
       </pre>
     */
    var FastArmature = (function (_super) {
        __extends(FastArmature, _super);
        function FastArmature(display) {
            _super.call(this);
            /**
             * 保证CacheManager是独占的前提下可以开启，开启后有助于性能提高
             */
            this.isCacheManagerExclusive = false;
            this._enableEventDispatch = true;
            this.useCache = true;
            this._display = display;
            this._animation = new dragonBones.FastAnimation(this);
            this._slotsZOrderChanged = false;
            this._armatureData = null;
            this.boneList = [];
            this._boneDic = {};
            this.slotList = [];
            this._slotDic = {};
            this.slotHasChildArmatureList = [];
            this._eventList = [];
            this._delayDispose = false;
            this._lockDispose = false;
        }
        /**
         * Cleans up any resources used by this instance.
         */
        FastArmature.prototype.dispose = function () {
            this._delayDispose = true;
            if (!this._animation || this._lockDispose) {
                return;
            }
            this.userData = null;
            this._animation.dispose();
            var i = this.slotList.length;
            while (i--) {
                this.slotList[i].dispose();
            }
            i = this.boneList.length;
            while (i--) {
                this.boneList[i].dispose();
            }
            this.slotList.length = 0;
            this.boneList.length = 0;
            this._armatureData = null;
            this._animation = null;
            this.slotList = null;
            this.boneList = null;
            this._eventList = null;
        };
        /**
         * Update the animation using this method typically in an ENTERFRAME Event or with a Timer.
         * @param The amount of second to move the playhead ahead.
         */
        FastArmature.prototype.advanceTime = function (passedTime) {
            this._lockDispose = true;
            this._animation.advanceTime(passedTime);
            var bone;
            var slot;
            var i = 0;
            if (this._animation.animationState.isUseCache()) {
                if (!this.useCache) {
                    this.useCache = true;
                }
                i = this.slotList.length;
                while (i--) {
                    slot = this.slotList[i];
                    slot.updateByCache();
                }
            }
            else {
                if (this.useCache) {
                    this.useCache = false;
                    i = this.slotList.length;
                    while (i--) {
                        slot = this.slotList[i];
                        slot.switchTransformToBackup();
                    }
                }
                i = this.boneList.length;
                while (i--) {
                    bone = this.boneList[i];
                    bone.update();
                }
                i = this.slotList.length;
                while (i--) {
                    slot = this.slotList[i];
                    slot._update();
                }
            }
            i = this.slotHasChildArmatureList.length;
            while (i--) {
                slot = this.slotHasChildArmatureList[i];
                var childArmature = slot.childArmature;
                if (childArmature) {
                    childArmature.advanceTime(passedTime);
                }
            }
            if (this._slotsZOrderChanged) {
                this.updateSlotsZOrder();
            }
            while (this._eventList.length > 0) {
                this.dispatchEvent(this._eventList.shift());
            }
            this._lockDispose = false;
            if (this._delayDispose) {
                this.dispose();
            }
        };
        /**
         * 开启动画缓存
         * @param  {number} 帧速率，每秒缓存多少次数据，越大越流畅,若值小于零会被设置为动画数据中的默认帧率
         * @param  {Array<any>} 需要缓存的动画列表，如果为null，则全部动画都缓存
         * @param  {boolean} 动画是否是循环动画，仅在3.0以下的数据格式使用，如果动画不是循环动画请设置为false，默认为true。
         * @return {AnimationCacheManager}  返回缓存管理器，可以绑定到其他armature以减少内存
         */
        FastArmature.prototype.enableAnimationCache = function (frameRate, animationList, loop) {
            if (animationList === void 0) { animationList = null; }
            if (loop === void 0) { loop = true; }
            var animationCacheManager = dragonBones.AnimationCacheManager.initWithArmatureData(this.armatureData, frameRate);
            if (animationList) {
                var length = animationList.length;
                for (var i = 0; i < length; i++) {
                    var animationName = animationList[i];
                    animationCacheManager.initAnimationCache(animationName);
                }
            }
            else {
                animationCacheManager.initAllAnimationCache();
            }
            animationCacheManager.setCacheGeneratorArmature(this);
            animationCacheManager.generateAllAnimationCache(loop);
            animationCacheManager.bindCacheUserArmature(this);
            this.enableCache = true;
            return animationCacheManager;
        };
        /**
         * 获取指定名称的 Bone
         * @param boneName {string} Bone名称
         * @returns {FastBone}
         */
        FastArmature.prototype.getBone = function (boneName) {
            return this._boneDic[boneName];
        };
        /**
         * 获取指定名称的 Slot
         * @param slotName {string} Slot名称
         * @returns {FastSlot}
         */
        FastArmature.prototype.getSlot = function (slotName) {
            return this._slotDic[slotName];
        };
        /**
         * 获取包含指定显示对象的 Bone
         * @param display {any} 显示对象实例
         * @returns {FastBone}
         */
        FastArmature.prototype.getBoneByDisplay = function (display) {
            var slot = this.getSlotByDisplay(display);
            return slot ? slot.parent : null;
        };
        /**
         * 获取包含指定显示对象的 Slot
         * @param displayObj {any} 显示对象实例
         * @returns {FastSlot}
         */
        FastArmature.prototype.getSlotByDisplay = function (displayObj) {
            if (displayObj) {
                for (var i = 0, len = this.slotList.length; i < len; i++) {
                    if (this.slotList[i].display == displayObj) {
                        return this.slotList[i];
                    }
                }
            }
            return null;
        };
        /**
         * 获取骨架包含的所有插槽
         * @param returnCopy {boolean} 是否返回拷贝。默认：true
         * @returns {FastSlot[]}
         */
        FastArmature.prototype.getSlots = function (returnCopy) {
            if (returnCopy === void 0) { returnCopy = true; }
            return returnCopy ? this.slotList.concat() : this.slotList;
        };
        FastArmature.prototype._updateBonesByCache = function () {
            var i = this.boneList.length;
            var bone;
            while (i--) {
                bone = this.boneList[i];
                bone.update();
            }
        };
        /**
         * 在骨架中为指定名称的 FastBone 添加一个子 FastBone.
         * 和Armature不同,FastArmature的这个方法不能在运行时动态添加骨骼
         * @param bone {FastBone} FastBone 实例
         * @param parentName {string} 父骨头名称 默认：null
         */
        FastArmature.prototype.addBone = function (bone, parentName) {
            if (parentName === void 0) { parentName = null; }
            var parentBone;
            if (parentName) {
                parentBone = this.getBone(parentName);
                parentBone.boneList.push(bone);
            }
            bone.armature = this;
            bone.setParent(parentBone);
            this.boneList.unshift(bone);
            this._boneDic[bone.name] = bone;
        };
        /**
         * 为指定名称的 FastBone 添加一个子 FastSlot.
         * 和Armature不同,FastArmature的这个方法不能在运行时动态添加插槽
         * @param slot {FastSlot} FastSlot 实例
         * @param boneName {string}
         * @see dragonBones.Bone
         */
        FastArmature.prototype.addSlot = function (slot, parentBoneName) {
            var bone = this.getBone(parentBoneName);
            if (bone) {
                slot.armature = this;
                slot.setParent(bone);
                bone.slotList.push(slot);
                slot._addDisplayToContainer(this.display);
                this.slotList.push(slot);
                this._slotDic[slot.name] = slot;
                if (slot.hasChildArmature) {
                    this.slotHasChildArmatureList.push(slot);
                }
            }
            else {
                throw new Error();
            }
        };
        /**
         * 按照显示层级为所有 Slot 排序
         */
        FastArmature.prototype.updateSlotsZOrder = function () {
            this.slotList.sort(this.sortSlot);
            var i = this.slotList.length;
            while (i--) {
                var slot = this.slotList[i];
                if ((slot._frameCache && (slot._frameCache).displayIndex >= 0)
                    || (!slot._frameCache && slot.displayIndex >= 0)) {
                    slot._addDisplayToContainer(this._display);
                }
            }
            this._slotsZOrderChanged = false;
        };
        FastArmature.prototype.sortBoneList = function () {
            var i = this.boneList.length;
            if (i == 0) {
                return;
            }
            var helpArray = [];
            while (i--) {
                var level = 0;
                var bone = this.boneList[i];
                var boneParent = bone;
                while (boneParent) {
                    level++;
                    boneParent = boneParent.parent;
                }
                helpArray[i] = [level, bone];
            }
            helpArray.sort(dragonBones.ArmatureData.sortBoneDataHelpArrayDescending);
            i = helpArray.length;
            while (i--) {
                this.boneList[i] = helpArray[i][1];
            }
            helpArray.length = 0;
        };
        /** @private When AnimationState enter a key frame, call this func*/
        FastArmature.prototype.arriveAtFrame = function (frame, animationState) {
            if (frame.event && this.hasEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT)) {
                var frameEvent = new dragonBones.FrameEvent(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT);
                frameEvent.animationState = animationState;
                frameEvent.frameLabel = frame.event;
                this._addEvent(frameEvent);
            }
            if (frame.action) {
                this.animation.gotoAndPlay(frame.action);
            }
        };
        FastArmature.prototype.invalidUpdate = function (boneName) {
            if (boneName === void 0) { boneName = null; }
            if (boneName) {
                var bone = this.getBone(boneName);
                if (bone) {
                    bone.invalidUpdate();
                }
            }
            else {
                var i = this.boneList.length;
                while (i--) {
                    this.boneList[i].invalidUpdate();
                }
            }
        };
        FastArmature.prototype.resetAnimation = function () {
            this.animation.animationState._resetTimelineStateList();
            var length = this.boneList.length;
            for (var i = 0; i < length; i++) {
                var boneItem = this.boneList[i];
                boneItem._timelineState = null;
            }
            this.animation.stop();
        };
        FastArmature.prototype.sortSlot = function (slot1, slot2) {
            return slot1.zOrder < slot2.zOrder ? 1 : -1;
        };
        /**
         * 获取FastAnimation实例
         * @returns {any} FastAnimation实例
         */
        FastArmature.prototype.getAnimation = function () {
            return this._animation;
        };
        Object.defineProperty(FastArmature.prototype, "armatureData", {
            /**
             * ArmatureData.
             * @see dragonBones.objects.ArmatureData.
             */
            get: function () {
                return this._armatureData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastArmature.prototype, "animation", {
            /**
             * An Animation instance
             * @see dragonBones.animation.Animation
             */
            get: function () {
                return this._animation;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastArmature.prototype, "display", {
            /**
             * Armature's display object. It's instance type depends on render engine. For example "flash.display.DisplayObject" or "startling.display.DisplayObject"
             */
            get: function () {
                return this._display;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastArmature.prototype, "enableCache", {
            get: function () {
                return this._enableCache;
            },
            set: function (value) {
                this._enableCache = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FastArmature.prototype, "enableEventDispatch", {
            get: function () {
                return this._enableEventDispatch;
            },
            set: function (value) {
                this._enableEventDispatch = value;
            },
            enumerable: true,
            configurable: true
        });
        FastArmature.prototype._addEvent = function (event) {
            if (this._enableEventDispatch) {
                this._eventList.push(event);
            }
        };
        return FastArmature;
    })(dragonBones.EventDispatcher);
    dragonBones.FastArmature = FastArmature;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.BaseFactory
     * @classdesc
     * 工厂的基类
     * @extends dragonBones.EventDispatcher
     *
     * @example
       <pre>
         //获取动画数据
         var skeletonData = RES.getRes("skeleton");
         //获取纹理集数据
         var textureData = RES.getRes("textureConfig");
         //获取纹理集图片
         var texture = RES.getRes("texture");
      
         //创建一个工厂，用来创建Armature
         var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
         //把动画数据添加到工厂里
         factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
         //把纹理集数据和图片添加到工厂里
         factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
         //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
         var armatureName:string = skeletonData.armature[0].name;
         //从工厂里创建出Armature
         var armature:dragonBones.Armature = factory.buildArmature(armatureName);
         //获取装载Armature的容器
         var armatureDisplay = armature.display;
         //把它添加到舞台上
         this.addChild(armatureDisplay);
         //取得这个Armature动画列表中的第一个动画的名字
         var curAnimationName = armature.animation.animationList[0];
         //播放这个动画，gotoAndPlay参数说明,具体详见Animation类
         //第一个参数 animationName {string} 指定播放动画的名称.
         //第二个参数 fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
         //第三个参数 duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
         //第四个参数 layTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
         armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);
      
         //把Armature添加到心跳时钟里
         dragonBones.WorldClock.clock.add(armature);
         //心跳时钟开启
         egret.Ticker.getInstance().register(function (advancedTime) {
             dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
         }, this);
       </pre>
     */
    var BaseFactory = (function (_super) {
        __extends(BaseFactory, _super);
        function BaseFactory(self) {
            _super.call(this);
            /** @private */
            this.dragonBonesDataDic = {};
            /** @private */
            this.textureAtlasDic = {};
            if (self != this) {
                throw new Error(egret.getString(4001));
            }
        }
        /**
         * 释放资源
         * @param  disposeData {boolean} (optional) 是否释放所有内部的引用
         */
        BaseFactory.prototype.dispose = function (disposeData) {
            if (disposeData === void 0) { disposeData = true; }
            if (disposeData) {
                for (var skeletonName in this.dragonBonesDataDic) {
                    (this.dragonBonesDataDic[skeletonName]).dispose();
                    delete this.dragonBonesDataDic[skeletonName];
                }
                for (var textureAtlasName in this.textureAtlasDic) {
                    (this.textureAtlasDic[textureAtlasName]).dispose();
                    delete this.textureAtlasDic[textureAtlasName];
                }
            }
            this.dragonBonesDataDic = null;
            this.textureAtlasDic = null;
            //_currentDataName = null;
            //_currentTextureAtlasName = null;
        };
        /**
         * 根据名字获取一个DragonBonesData
         * @param name {string} 想要获取的DragonBonesData的名字
         * @returns {dragonBones.DragonBonesData} 返回指定名字的DragonBonesData（如果存在的话）
         */
        BaseFactory.prototype.getDragonBonesData = function (name) {
            return this.dragonBonesDataDic[name];
        };
        /**
         * 根据名字获取一个DragonBonesData（不推荐使用）
         * 建议使用方法getDragonBonesData来代替这个方法
         */
        BaseFactory.prototype.getSkeletonData = function (name) {
            return this.getDragonBonesData(name);
        };
        /**
         * 添加一个DragonBonesData实例
         * @param data {dragonBones.DragonBonesData} 一个DragonBonesData实例
         * @param name {string} (optional) DragonBonesData的名字
         */
        BaseFactory.prototype.addDragonBonesData = function (data, name) {
            if (name === void 0) { name = null; }
            if (!data) {
                throw new Error();
            }
            name = name || data.name;
            if (!name) {
                throw new Error(egret.getString(4002));
            }
            /*
            if(this.dragonBonesDataDic[name]){
                throw new Error();
            }*/
            this.dragonBonesDataDic[name] = data;
        };
        /**
         * 添加一个DragonBonesData实例（不推荐使用）
         * 建议使用方法addDragonBonesData来代替
         */
        BaseFactory.prototype.addSkeletonData = function (data, name) {
            if (name === void 0) { name = null; }
            this.addDragonBonesData(data, name);
        };
        /**
         * 根据名字移除一个DragonBonesData实例.
         * @param name {string} 想要移除的DragonBonesData的名字
         */
        BaseFactory.prototype.removeDragonBonesData = function (name) {
            delete this.dragonBonesDataDic[name];
        };
        /**
         * 根据名字移除一个DragonBonesData实例.（不推荐使用）
         * 建议使用方法removeDragonBonesData代替
         */
        BaseFactory.prototype.removeSkeletonData = function (name) {
            delete this.dragonBonesDataDic[name];
        };
        /**
         * 根据名字获取纹理集TextureAtlas
         * @param name {string} 需要获取的纹理集TextureAtlas的名字
         * @returns {any} 纹理集TextureAtlas
         */
        BaseFactory.prototype.getTextureAtlas = function (name) {
            return this.textureAtlasDic[name];
        };
        /**
         * 添加一个纹理集
         * @param textureAtlas {any} 需要被添加的纹理集
         * @param name {string} (optional) 需要被添加的纹理集的名字
         */
        BaseFactory.prototype.addTextureAtlas = function (textureAtlas, name) {
            if (name === void 0) { name = null; }
            if (!textureAtlas) {
                throw new Error();
            }
            /*
            if(!name && textureAtlas instanceof ITextureAtlas){
                name = textureAtlas.name;
            }
            */
            if (!name && textureAtlas.hasOwnProperty("name")) {
                name = textureAtlas.name;
            }
            if (!name) {
                throw new Error(egret.getString(4002));
            }
            /*
            if(this.textureAtlasDic[name]){
                throw new Error();
            }*/
            this.textureAtlasDic[name] = textureAtlas;
        };
        /**
         * 移除指定名字的纹理集
         * @param name {string} 需要移除的纹理集的名字
         */
        BaseFactory.prototype.removeTextureAtlas = function (name) {
            delete this.textureAtlasDic[name];
        };
        /**
         * 获取TextureDisplay
         * @param textureName {string} 纹理的名字
         * @param textureAtlasName {string} 纹理集的名字
         * @param pivotX {number} 轴点的x坐标
         * @param pivotY {number} 轴点的y坐标
         * @returns {any} 返回的TextureDisplay
         */
        BaseFactory.prototype.getTextureDisplay = function (textureName, textureAtlasName, pivotX, pivotY) {
            if (textureAtlasName === void 0) { textureAtlasName = null; }
            if (pivotX === void 0) { pivotX = NaN; }
            if (pivotY === void 0) { pivotY = NaN; }
            var targetTextureAtlas;
            if (textureAtlasName) {
                targetTextureAtlas = this.textureAtlasDic[textureAtlasName];
            }
            else {
                for (textureAtlasName in this.textureAtlasDic) {
                    targetTextureAtlas = this.textureAtlasDic[textureAtlasName];
                    if (targetTextureAtlas.getRegion(textureName)) {
                        break;
                    }
                    targetTextureAtlas = null;
                }
            }
            if (!targetTextureAtlas) {
                return null;
            }
            if (isNaN(pivotX) || isNaN(pivotY)) {
                //默认dragonBonesData的名字和和纹理集的名字是一致的
                var data = this.dragonBonesDataDic[textureAtlasName];
                data = data ? data : this.findFirstDragonBonesData();
                if (data) {
                    var displayData = data.getDisplayDataByName(textureName);
                    if (displayData) {
                        pivotX = displayData.pivot.x;
                        pivotY = displayData.pivot.y;
                    }
                }
            }
            return this._generateDisplay(targetTextureAtlas, textureName, pivotX, pivotY);
        };
        /**
         * 构建骨架
         * 一般情况下dragonBonesData和textureAtlas是一对一的，通过相同的key对应。
         * TO DO 以后会支持一对多的情况
         * @param armatureName 骨架的名字
         * @param fromDragonBonesDataName 骨架数据的名字 可选参数
         * @param fromTextureAtlasName 纹理集的名字 可选参数
         * @param skinName 皮肤的名字 可选参数
         * @returns {*}
         */
        BaseFactory.prototype.buildArmature = function (armatureName, fromDragonBonesDataName, fromTextureAtlasName, skinName) {
            if (fromDragonBonesDataName === void 0) { fromDragonBonesDataName = null; }
            if (fromTextureAtlasName === void 0) { fromTextureAtlasName = null; }
            if (skinName === void 0) { skinName = null; }
            var buildArmatureDataPackage = {};
            if (this.fillBuildArmatureDataPackageArmatureInfo(armatureName, fromDragonBonesDataName, buildArmatureDataPackage)) {
                this.fillBuildArmatureDataPackageTextureInfo(fromTextureAtlasName, buildArmatureDataPackage);
            }
            var dragonBonesData = buildArmatureDataPackage.dragonBonesData;
            var armatureData = buildArmatureDataPackage.armatureData;
            var textureAtlas = buildArmatureDataPackage.textureAtlas;
            if (!armatureData || !textureAtlas) {
                return null;
            }
            return this.buildArmatureUsingArmatureDataFromTextureAtlas(dragonBonesData, armatureData, textureAtlas, skinName);
        };
        /**
         * 构建fast骨架
         * 一般情况下dragonBonesData和textureAtlas是一对一的，通过相同的key对应。
         * TO DO 以后会支持一对多的情况
         * @param armatureName 骨架的名字
         * @param fromDragonBonesDataName 骨架数据的名字 可选参数
         * @param fromTextureAtlasName 纹理集的名字 可选参数
         * @param skinName 皮肤的名字 可选参数
         * @returns {*}
         */
        BaseFactory.prototype.buildFastArmature = function (armatureName, fromDragonBonesDataName, fromTextureAtlasName, skinName) {
            if (fromDragonBonesDataName === void 0) { fromDragonBonesDataName = null; }
            if (fromTextureAtlasName === void 0) { fromTextureAtlasName = null; }
            if (skinName === void 0) { skinName = null; }
            var buildArmatureDataPackage = new BuildArmatureDataPackage();
            if (this.fillBuildArmatureDataPackageArmatureInfo(armatureName, fromDragonBonesDataName, buildArmatureDataPackage)) {
                this.fillBuildArmatureDataPackageTextureInfo(fromTextureAtlasName, buildArmatureDataPackage);
            }
            var dragonBonesData = buildArmatureDataPackage.dragonBonesData;
            var armatureData = buildArmatureDataPackage.armatureData;
            var textureAtlas = buildArmatureDataPackage.textureAtlas;
            if (!armatureData || !textureAtlas) {
                return null;
            }
            return this.buildFastArmatureUsingArmatureDataFromTextureAtlas(dragonBonesData, armatureData, textureAtlas, skinName);
        };
        /**
         * 用dragonBones数据，骨架数据，纹理集数据来构建骨架
         * @param dragonBonesData dragonBones数据
         * @param armatureData 骨架数据
         * @param textureAtlas 纹理集
         * @param skinName 皮肤名称 可选参数
         * @returns {Armature}
         */
        BaseFactory.prototype.buildArmatureUsingArmatureDataFromTextureAtlas = function (dragonBonesData, armatureData, textureAtlas, skinName) {
            if (skinName === void 0) { skinName = null; }
            var outputArmature = this._generateArmature();
            outputArmature.name = armatureData.name;
            outputArmature.__dragonBonesData = dragonBonesData;
            outputArmature._armatureData = armatureData;
            outputArmature.animation.animationDataList = armatureData.animationDataList;
            this._buildBones(outputArmature);
            //TO DO: Support multi textureAtlas case in future
            this._buildSlots(outputArmature, skinName, textureAtlas);
            outputArmature.advanceTime(0);
            return outputArmature;
        };
        /**
         * 用dragonBones数据，骨架数据，纹理集数据来构建骨架
         * @param dragonBonesData dragonBones数据
         * @param armatureData 骨架数据
         * @param textureAtlas 纹理集
         * @param skinName 皮肤名称 可选参数
         * @returns {Armature}
         */
        BaseFactory.prototype.buildFastArmatureUsingArmatureDataFromTextureAtlas = function (dragonBonesData, armatureData, textureAtlas, skinName) {
            if (skinName === void 0) { skinName = null; }
            var outputArmature = this._generateFastArmature();
            outputArmature.name = armatureData.name;
            outputArmature.__dragonBonesData = dragonBonesData;
            outputArmature._armatureData = armatureData;
            outputArmature.animation.animationDataList = armatureData.animationDataList;
            this._buildFastBones(outputArmature);
            //TO DO: Support multi textureAtlas case in future
            this._buildFastSlots(outputArmature, skinName, textureAtlas);
            outputArmature.advanceTime(0);
            return outputArmature;
        };
        /**
         * 拷贝动画到骨架中
         * 暂时不支持ifRemoveOriginalAnimationList为false的情况
         * @param toArmature  拷贝到的那个骨架
         * @param fromArmatreName 从哪个骨架里拷贝，骨架的名字
         * @param fromDragonBonesDataName 从哪个DragonBones数据中拷贝，Dragonbones数据的名字
         * @param ifRemoveOriginalAnimationList 是否移除原骨架里的动画，暂时不支持为false的情况
         * @returns {boolean}
         */
        BaseFactory.prototype.copyAnimationsToArmature = function (toArmature, fromArmatreName, fromDragonBonesDataName, ifRemoveOriginalAnimationList) {
            if (fromDragonBonesDataName === void 0) { fromDragonBonesDataName = null; }
            if (ifRemoveOriginalAnimationList === void 0) { ifRemoveOriginalAnimationList = true; }
            var buildArmatureDataPackage = {};
            if (!this.fillBuildArmatureDataPackageArmatureInfo(fromArmatreName, fromDragonBonesDataName, buildArmatureDataPackage)) {
                return false;
            }
            var fromArmatureData = buildArmatureDataPackage.armatureData;
            toArmature.animation.animationDataList = fromArmatureData.animationDataList;
            //处理子骨架的复制
            var fromSkinData = fromArmatureData.getSkinData("");
            var fromSlotData;
            var fromDisplayData;
            var toSlotList = toArmature.getSlots(false);
            var toSlot;
            var toSlotDisplayList;
            var toSlotDisplayListLength = 0;
            var toDisplayObject;
            var toChildArmature;
            var length1 = toSlotList.length;
            for (var i1 = 0; i1 < length1; i1++) {
                toSlot = toSlotList[i1];
                toSlotDisplayList = toSlot.displayList;
                toSlotDisplayListLength = toSlotDisplayList.length;
                for (var i = 0; i < toSlotDisplayListLength; i++) {
                    toDisplayObject = toSlotDisplayList[i];
                    if (toDisplayObject instanceof dragonBones.Armature) {
                        toChildArmature = toDisplayObject;
                        fromSlotData = fromSkinData.getSlotData(toSlot.name);
                        fromDisplayData = fromSlotData.displayDataList[i];
                        if (fromDisplayData.type == dragonBones.DisplayData.ARMATURE) {
                            this.copyAnimationsToArmature(toChildArmature, fromDisplayData.name, buildArmatureDataPackage.dragonBonesDataName, ifRemoveOriginalAnimationList);
                        }
                    }
                }
            }
            return true;
        };
        BaseFactory.prototype.fillBuildArmatureDataPackageArmatureInfo = function (armatureName, dragonBonesDataName, outputBuildArmatureDataPackage) {
            if (dragonBonesDataName) {
                outputBuildArmatureDataPackage.dragonBonesDataName = dragonBonesDataName;
                outputBuildArmatureDataPackage.dragonBonesData = this.dragonBonesDataDic[dragonBonesDataName];
                outputBuildArmatureDataPackage.armatureData = outputBuildArmatureDataPackage.dragonBonesData.getArmatureDataByName(armatureName);
                return true;
            }
            else {
                for (dragonBonesDataName in this.dragonBonesDataDic) {
                    outputBuildArmatureDataPackage.dragonBonesData = this.dragonBonesDataDic[dragonBonesDataName];
                    outputBuildArmatureDataPackage.armatureData = outputBuildArmatureDataPackage.dragonBonesData.getArmatureDataByName(armatureName);
                    if (outputBuildArmatureDataPackage.armatureData) {
                        outputBuildArmatureDataPackage.dragonBonesDataName = dragonBonesDataName;
                        return true;
                    }
                }
            }
            return false;
        };
        BaseFactory.prototype.fillBuildArmatureDataPackageTextureInfo = function (fromTextureAtlasName, outputBuildArmatureDataPackage) {
            outputBuildArmatureDataPackage.textureAtlas = this.textureAtlasDic[fromTextureAtlasName ? fromTextureAtlasName : outputBuildArmatureDataPackage.dragonBonesDataName];
        };
        BaseFactory.prototype.findFirstDragonBonesData = function () {
            for (var key in this.dragonBonesDataDic) {
                var outputDragonBonesData = this.dragonBonesDataDic[key];
                if (outputDragonBonesData) {
                    return outputDragonBonesData;
                }
            }
            return null;
        };
        BaseFactory.prototype.findFirstTextureAtlas = function () {
            for (var key in this.textureAtlasDic) {
                var outputTextureAtlas = this.textureAtlasDic[key];
                if (outputTextureAtlas) {
                    return outputTextureAtlas;
                }
            }
            return null;
        };
        BaseFactory.prototype._buildBones = function (armature) {
            //按照从属关系的顺序建立
            var boneDataList = armature.armatureData.boneDataList;
            var boneData;
            var bone;
            var parent;
            for (var i = 0; i < boneDataList.length; i++) {
                boneData = boneDataList[i];
                bone = dragonBones.Bone.initWithBoneData(boneData);
                parent = boneData.parent;
                if (parent && armature.armatureData.getBoneData(parent) == null) {
                    parent = null;
                }
                //Todo use a internal addBone method to avoid sortBones every time.
                armature.addBone(bone, parent, true);
            }
            armature._updateAnimationAfterBoneListChanged();
        };
        BaseFactory.prototype._buildSlots = function (armature, skinName, textureAtlas) {
            var skinData = armature.armatureData.getSkinData(skinName);
            if (!skinData) {
                return;
            }
            armature.armatureData.setSkinData(skinName);
            var displayList = [];
            var slotDataList = armature.armatureData.slotDataList;
            var slotData;
            var slot;
            var bone;
            for (var i = 0; i < slotDataList.length; i++) {
                slotData = slotDataList[i];
                bone = armature.getBone(slotData.parent);
                if (!bone) {
                    continue;
                }
                slot = this._generateSlot();
                slot.initWithSlotData(slotData);
                bone.addSlot(slot);
                displayList.length = 0;
                var l = slotData.displayDataList.length;
                while (l--) {
                    var displayData = slotData.displayDataList[l];
                    switch (displayData.type) {
                        case dragonBones.DisplayData.ARMATURE:
                            var childArmature = this.buildArmatureUsingArmatureDataFromTextureAtlas(armature.__dragonBonesData, armature.__dragonBonesData.getArmatureDataByName(displayData.name), textureAtlas, skinName);
                            displayList[l] = childArmature;
                            break;
                        case dragonBones.DisplayData.IMAGE:
                        default:
                            displayList[l] = this._generateDisplay(textureAtlas, displayData.name, displayData.pivot.x, displayData.pivot.y);
                            break;
                    }
                }
                //==================================================
                //如果显示对象有name属性并且name属性可以设置的话，将name设置为与slot同名，dragonBones并不依赖这些属性，只是方便开发者
                for (var j = 0, jLen = displayList.length; j < jLen; j++) {
                    var displayObject = displayList[j];
                    if (!displayObject) {
                        continue;
                    }
                    if (displayObject instanceof dragonBones.Armature) {
                        displayObject = displayObject.display;
                    }
                    if (displayObject.hasOwnProperty("name")) {
                        try {
                            displayObject["name"] = slot.name;
                        }
                        catch (err) {
                        }
                    }
                }
                //==================================================
                slot.displayList = displayList;
                slot._changeDisplay(slotData.displayIndex);
            }
        };
        BaseFactory.prototype._buildFastBones = function (armature) {
            //按照从属关系的顺序建立
            var boneDataList = armature.armatureData.boneDataList;
            var boneData;
            var bone;
            for (var i = 0; i < boneDataList.length; i++) {
                boneData = boneDataList[i];
                bone = dragonBones.FastBone.initWithBoneData(boneData);
                armature.addBone(bone, boneData.parent);
            }
        };
        BaseFactory.prototype._buildFastSlots = function (armature, skinName, textureAtlas) {
            //根据皮肤初始化SlotData的DisplayDataList
            var skinData = armature.armatureData.getSkinData(skinName);
            if (!skinData) {
                return;
            }
            armature.armatureData.setSkinData(skinName);
            var displayList = [];
            var slotDataList = armature.armatureData.slotDataList;
            var slotData;
            var slot;
            for (var i = 0; i < slotDataList.length; i++) {
                displayList.length = 0;
                slotData = slotDataList[i];
                slot = this._generateFastSlot();
                slot.initWithSlotData(slotData);
                var l = slotData.displayDataList.length;
                while (l--) {
                    var displayData = slotData.displayDataList[l];
                    switch (displayData.type) {
                        case dragonBones.DisplayData.ARMATURE:
                            var childArmature = this.buildFastArmatureUsingArmatureDataFromTextureAtlas(armature.__dragonBonesData, armature.__dragonBonesData.getArmatureDataByName(displayData.name), textureAtlas, skinName);
                            displayList[l] = childArmature;
                            slot.hasChildArmature = true;
                            break;
                        case dragonBones.DisplayData.IMAGE:
                        default:
                            displayList[l] = this._generateDisplay(textureAtlas, displayData.name, displayData.pivot.x, displayData.pivot.y);
                            break;
                    }
                }
                //==================================================
                //如果显示对象有name属性并且name属性可以设置的话，将name设置为与slot同名，dragonBones并不依赖这些属性，只是方便开发者
                var length1 = displayList.length;
                for (var i1 = 0; i1 < length1; i1++) {
                    var displayObject = displayList[i1];
                    if (!displayObject) {
                        continue;
                    }
                    if (displayObject instanceof dragonBones.FastArmature) {
                        displayObject = displayObject.display;
                    }
                    if (displayObject.hasOwnProperty("name")) {
                        try {
                            displayObject["name"] = slot.name;
                        }
                        catch (err) {
                        }
                    }
                }
                //==================================================
                slot.initDisplayList(displayList.concat());
                armature.addSlot(slot, slotData.parent);
                slot._changeDisplayIndex(slotData.displayIndex);
            }
        };
        /**
         * @private
         * Generates an Armature instance.
         * @returns {dragonBones.Armature} Armature An Armature instance.
         */
        BaseFactory.prototype._generateArmature = function () {
            return null;
        };
        /**
         * @private
         * Generates an Slot instance.
         * @returns {dragonBones.Slot} Slot An Slot instance.
         */
        BaseFactory.prototype._generateSlot = function () {
            return null;
        };
        /**
         * @private
         * Generates an Armature instance.
         * @returns {dragonBones.Armature} Armature An Armature instance.
         */
        BaseFactory.prototype._generateFastArmature = function () {
            return null;
        };
        /**
         * @private
         * Generates an Slot instance.
         * @returns {dragonBones.Slot} Slot An Slot instance.
         */
        BaseFactory.prototype._generateFastSlot = function () {
            return null;
        };
        /**
         * @private
         * Generates a DisplayObject
         * @param textureAtlas {any} The TextureAtlas.
         * @param fullName {string} A qualified name.
         * @param pivotX {number} A pivot x based value.
         * @param pivotY {number} A pivot y based value.
         * @returns {any}
         */
        BaseFactory.prototype._generateDisplay = function (textureAtlas, fullName, pivotX, pivotY) {
            return null;
        };
        BaseFactory._helpMatrix = new dragonBones.Matrix();
        return BaseFactory;
    })(dragonBones.EventDispatcher);
    dragonBones.BaseFactory = BaseFactory;
    var BuildArmatureDataPackage = (function () {
        function BuildArmatureDataPackage() {
        }
        return BuildArmatureDataPackage;
    })();
    dragonBones.BuildArmatureDataPackage = BuildArmatureDataPackage;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////
var dragonBones;
(function (dragonBones) {
    /**
     *
     *
     * @example
       <pre>
        private exampleEvent():void
        {
            //获取动画数据
            var skeletonData = RES.getRes("skeleton");
            //获取纹理集数据
            var textureData = RES.getRes("textureConfig");
            //获取纹理集图片
            var texture = RES.getRes("texture");

            //创建一个工厂，用来创建Armature
            var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
            //把动画数据添加到工厂里
            factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
            //把纹理集数据和图片添加到工厂里
            factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));

            //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
            var armatureName:string = skeletonData.armature[0].name;
            //从工厂里创建出Armature
            var armature:dragonBones.Armature = factory.buildArmature(armatureName);
            //获取装载Armature的容器
            var armatureDisplay = armature.display;
            armatureDisplay.x = 200;
            armatureDisplay.y = 400;
            //把它添加到舞台上
            this.addChild(armatureDisplay);

            //监听事件时间轴上的事件
            armature.addEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.onFrameEvent,this);
            //监听骨骼时间轴上的事件
            armature.addEventListener(dragonBones.FrameEvent.BONE_FRAME_EVENT, this.onFrameEvent,this);
            //监听动画完成事件
            armature.addEventListener(dragonBones.AnimationEvent.COMPLETE, this.onAnimationEvent,this);
            //监听动画开始事件
            armature.addEventListener(dragonBones.AnimationEvent.START, this.onAnimationEvent,this);
            //监听循环动画，播放完一遍的事件
            armature.addEventListener(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onAnimationEvent,this);
            //监听声音事件
            var soundManager:dragonBones.SoundEventManager = dragonBones.SoundEventManager.getInstance();
            soundManager.addEventListener(dragonBones.SoundEvent.SOUND, this.onSoundEvent,this);

            //取得这个Armature动画列表中的第一个动画的名字
            var curAnimationName = armature.animation.animationList[0];
            //播放一遍动画
            armature.animation.gotoAndPlay(curAnimationName,0,-1,1);

            //把Armature添加到心跳时钟里
            dragonBones.WorldClock.clock.add(armature);
            //心跳时钟开启
            egret.Ticker.getInstance().register(function (advancedTime) {
                dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
            }, this);
        }
        private onFrameEvent(evt: dragonBones.FrameEvent):void
        {
            //打印出事件的类型，和事件的帧标签
            console.log(evt.type, evt.frameLabel);
        }

        private onAnimationEvent(evt: dragonBones.AnimationEvent):void
        {
            switch(evt.type)
            {
                case dragonBones.AnimationEvent.START:
                     break;
                case dragonBones.AnimationEvent.LOOP_COMPLETE:
                     break;
                case dragonBones.AnimationEvent.COMPLETE:
                     //动画完成后销毁这个armature
                     this.removeChild(evt.armature.display);
                     dragonBones.WorldClock.clock.remove(evt.armature);
                     evt.armature.dispose();
                     break;
            }
        }

        private onSoundEvent(evt: dragonBones.SoundEvent):void
        {
            //播放声音
            var flySound:egret.Sound = RES.getRes(evt.sound);
            console.log("soundEvent",evt.sound);
        }

       </pre>
     */
    var SoundEventManager = (function (_super) {
        __extends(SoundEventManager, _super);
        function SoundEventManager() {
            _super.call(this);
            if (SoundEventManager._instance) {
                throw new Error("Singleton already constructed!");
            }
        }
        SoundEventManager.getInstance = function () {
            if (!SoundEventManager._instance) {
                SoundEventManager._instance = new SoundEventManager();
            }
            return SoundEventManager._instance;
        };
        return SoundEventManager;
    })(dragonBones.EventDispatcher);
    dragonBones.SoundEventManager = SoundEventManager;
})(dragonBones || (dragonBones = {})); 
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.Event
     * @classdesc
     * 事件
     */
    var Event = (function (_super) {
        //__extends(Event, _super);
        /**
         * 创建一个Event实例
         * @param type 事件的类型
         */
        function Event(type, bubbles, cancelable) {
            if (bubbles === void 0) { bubbles = false; }
            if (cancelable === void 0) { cancelable = false; }
            this.bubbles = bubbles;
            this.cancelable = cancelable;
            this.type = type;
       //     _super.call(this, type, bubbles, cancelable);
        }
        return Event;
    })();
    dragonBones.Event = Event;
})(dragonBones || (dragonBones = {})); 
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.SoundEvent
     * @extends dragonBones.Event
     * @classdesc
     * 声音事件
     *
     * @example
       <pre>
        private exampleEvent():void
        {
            //获取动画数据
            var skeletonData = RES.getRes("skeleton");
            //获取纹理集数据
            var textureData = RES.getRes("textureConfig");
            //获取纹理集图片
            var texture = RES.getRes("texture");

            //创建一个工厂，用来创建Armature
            var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
            //把动画数据添加到工厂里
            factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
            //把纹理集数据和图片添加到工厂里
            factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));

            //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
            var armatureName:string = skeletonData.armature[0].name;
            //从工厂里创建出Armature
            var armature:dragonBones.Armature = factory.buildArmature(armatureName);
            //获取装载Armature的容器
            var armatureDisplay = armature.display;
            armatureDisplay.x = 200;
            armatureDisplay.y = 400;
            //把它添加到舞台上
            this.addChild(armatureDisplay);

            //监听事件时间轴上的事件
            armature.addEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.onFrameEvent,this);
            //监听骨骼时间轴上的事件
            armature.addEventListener(dragonBones.FrameEvent.BONE_FRAME_EVENT, this.onFrameEvent,this);
            //监听动画完成事件
            armature.addEventListener(dragonBones.AnimationEvent.COMPLETE, this.onAnimationEvent,this);
            //监听动画开始事件
            armature.addEventListener(dragonBones.AnimationEvent.START, this.onAnimationEvent,this);
            //监听循环动画，播放完一遍的事件
            armature.addEventListener(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onAnimationEvent,this);
            //监听声音事件
            var soundManager:dragonBones.SoundEventManager = dragonBones.SoundEventManager.getInstance();
            soundManager.addEventListener(dragonBones.SoundEvent.SOUND, this.onSoundEvent,this);

            //取得这个Armature动画列表中的第一个动画的名字
            var curAnimationName = armature.animation.animationList[0];
            //播放一遍动画
            armature.animation.gotoAndPlay(curAnimationName,0,-1,1);

            //把Armature添加到心跳时钟里
            dragonBones.WorldClock.clock.add(armature);
            //心跳时钟开启
            egret.Ticker.getInstance().register(function (advancedTime) {
                dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
            }, this);
        }
        private onFrameEvent(evt: dragonBones.FrameEvent):void
        {
            //打印出事件的类型，和事件的帧标签
            console.log(evt.type, evt.frameLabel);
        }

        private onAnimationEvent(evt: dragonBones.AnimationEvent):void
        {
            switch(evt.type)
            {
                case dragonBones.AnimationEvent.START:
                     break;
                case dragonBones.AnimationEvent.LOOP_COMPLETE:
                     break;
                case dragonBones.AnimationEvent.COMPLETE:
                     //动画完成后销毁这个armature
                     this.removeChild(evt.armature.display);
                     dragonBones.WorldClock.clock.remove(evt.armature);
                     evt.armature.dispose();
                     break;
            }
        }

        private onSoundEvent(evt: dragonBones.SoundEvent):void
        {
            //播放声音
            var flySound:egret.Sound = RES.getRes(evt.sound);
            console.log("soundEvent",evt.sound);
        }

       </pre>
     */
    var SoundEvent = (function (_super) {
        __extends(SoundEvent, _super);
        /**
         * Creates a new SoundEvent instance.
         * @param type
         * @param cancelable
         */
        function SoundEvent(type, cancelable) {
            if (cancelable === void 0) { cancelable = false; }
            _super.call(this, type);
        }
        /**
         * Dispatched when the animation of the animation enter a frame containing sound labels.
         */
        SoundEvent.SOUND = "sound";
        return SoundEvent;
    })(dragonBones.Event);
    dragonBones.SoundEvent = SoundEvent;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////
//
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.FrameEvent
     * @extends dragonBones.Event
     * @classdesc
     * 帧事件
     *
     * @example
     * <pre>
     *  private exampleEvent():void
        {
            //获取动画数据
            var skeletonData = RES.getRes("skeleton");
            //获取纹理集数据
            var textureData = RES.getRes("textureConfig");
            //获取纹理集图片
            var texture = RES.getRes("texture");

            //创建一个工厂，用来创建Armature
            var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
            //把动画数据添加到工厂里
            factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
            //把纹理集数据和图片添加到工厂里
            factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));

            //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
            var armatureName:string = skeletonData.armature[0].name;
            //从工厂里创建出Armature
            var armature:dragonBones.Armature = factory.buildArmature(armatureName);
            //获取装载Armature的容器
            var armatureDisplay = armature.display;
            armatureDisplay.x = 200;
            armatureDisplay.y = 400;
            //把它添加到舞台上
            this.addChild(armatureDisplay);

            //监听事件时间轴上的事件
            armature.addEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.onFrameEvent,this);
            //监听骨骼时间轴上的事件
            armature.addEventListener(dragonBones.FrameEvent.BONE_FRAME_EVENT, this.onFrameEvent,this);
            //监听动画完成事件
            armature.addEventListener(dragonBones.AnimationEvent.COMPLETE, this.onAnimationEvent,this);
            //监听动画开始事件
            armature.addEventListener(dragonBones.AnimationEvent.START, this.onAnimationEvent,this);
            //监听循环动画，播放完一遍的事件
            armature.addEventListener(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onAnimationEvent,this);
            //监听声音事件
            var soundManager:dragonBones.SoundEventManager = dragonBones.SoundEventManager.getInstance();
            soundManager.addEventListener(dragonBones.SoundEvent.SOUND, this.onSoundEvent,this);

            //取得这个Armature动画列表中的第一个动画的名字
            var curAnimationName = armature.animation.animationList[0];
            //播放一遍动画
            armature.animation.gotoAndPlay(curAnimationName,0,-1,1);

            //把Armature添加到心跳时钟里
            dragonBones.WorldClock.clock.add(armature);
            //心跳时钟开启
            egret.Ticker.getInstance().register(function (advancedTime) {
                dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
            }, this);
        }
        private onFrameEvent(evt: dragonBones.FrameEvent):void
        {
            //打印出事件的类型，和事件的帧标签
            console.log(evt.type, evt.frameLabel);
        }

        private onAnimationEvent(evt: dragonBones.AnimationEvent):void
        {
            switch(evt.type)
            {
                case dragonBones.AnimationEvent.START:
                     break;
                case dragonBones.AnimationEvent.LOOP_COMPLETE:
                     break;
                case dragonBones.AnimationEvent.COMPLETE:
                     //动画完成后销毁这个armature
                     this.removeChild(evt.armature.display);
                     dragonBones.WorldClock.clock.remove(evt.armature);
                     evt.armature.dispose();
                     break;
            }
        }

        private onSoundEvent(evt: dragonBones.SoundEvent):void
        {
            //播放声音
            var flySound:egret.Sound = RES.getRes(evt.sound);
            console.log("soundEvent",evt.sound);
        }

     * </pre>
     */
    var FrameEvent = (function (_super) {
        __extends(FrameEvent, _super);
        /**
         * 创建一个新的 FrameEvent 实例
         * @param type 事件类型
         * @param cancelable
         */
        function FrameEvent(type, cancelable) {
            if (cancelable === void 0) { cancelable = false; }
            _super.call(this, type);
        }
        Object.defineProperty(FrameEvent, "MOVEMENT_FRAME_EVENT", {
            get: function () {
                return FrameEvent.ANIMATION_FRAME_EVENT;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameEvent.prototype, "armature", {
            /**
             * 派发这个事件的骨架
             * @member {dragonBones.Armature} dragonBones.FrameEvent#armature
             */
            get: function () {
                return (this.target);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 当动画播放到一个关键帧时派发
         */
        FrameEvent.ANIMATION_FRAME_EVENT = "animationFrameEvent";
        /**
         *
         */
        FrameEvent.BONE_FRAME_EVENT = "boneFrameEvent";
        return FrameEvent;
    })(dragonBones.Event);
    dragonBones.FrameEvent = FrameEvent;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////

var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.ArmatureEvent
     * @extends dragonBones.Event
     * @classdesc
     * 骨架事件
     */
    var ArmatureEvent = (function (_super) {
        __extends(ArmatureEvent, _super);
        /**
         * 创建一个 ArmatureEvent 的实例
         * @param type 事件类型
         */
        function ArmatureEvent(type) {
            _super.call(this, type);
        }
        /**
         * 当zOrder成功更新后派发
         */
        ArmatureEvent.Z_ORDER_UPDATED = "zOrderUpdated";
        return ArmatureEvent;
    })(dragonBones.Event);
    dragonBones.ArmatureEvent = ArmatureEvent;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////

var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.AnimationEvent
     * @extends dragonBones.Event
     * @classdesc
     * 动画事件
     *
     * @example
       <pre>
        private exampleEvent():void
        {
            //获取动画数据
            var skeletonData = RES.getRes("skeleton");
            //获取纹理集数据
            var textureData = RES.getRes("textureConfig");
            //获取纹理集图片
            var texture = RES.getRes("texture");

            //创建一个工厂，用来创建Armature
            var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
            //把动画数据添加到工厂里
            factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
            //把纹理集数据和图片添加到工厂里
            factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));

            //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
            var armatureName:string = skeletonData.armature[0].name;
            //从工厂里创建出Armature
            var armature:dragonBones.Armature = factory.buildArmature(armatureName);
            //获取装载Armature的容器
            var armatureDisplay = armature.display;
            armatureDisplay.x = 200;
            armatureDisplay.y = 400;
            //把它添加到舞台上
            this.addChild(armatureDisplay);

            //监听事件时间轴上的事件
            armature.addEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.onFrameEvent,this);
            //监听骨骼时间轴上的事件
            armature.addEventListener(dragonBones.FrameEvent.BONE_FRAME_EVENT, this.onFrameEvent,this);
            //监听动画完成事件
            armature.addEventListener(dragonBones.AnimationEvent.COMPLETE, this.onAnimationEvent,this);
            //监听动画开始事件
            armature.addEventListener(dragonBones.AnimationEvent.START, this.onAnimationEvent,this);
            //监听循环动画，播放完一遍的事件
            armature.addEventListener(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onAnimationEvent,this);
            //监听声音事件
            var soundManager:dragonBones.SoundEventManager = dragonBones.SoundEventManager.getInstance();
            soundManager.addEventListener(dragonBones.SoundEvent.SOUND, this.onSoundEvent,this);

            //取得这个Armature动画列表中的第一个动画的名字
            var curAnimationName = armature.animation.animationList[0];
            //播放一遍动画
            armature.animation.gotoAndPlay(curAnimationName,0,-1,1);

            //把Armature添加到心跳时钟里
            dragonBones.WorldClock.clock.add(armature);
            //心跳时钟开启
            egret.Ticker.getInstance().register(function (advancedTime) {
                dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
            }, this);
        }
        private onFrameEvent(evt: dragonBones.FrameEvent):void
        {
            //打印出事件的类型，和事件的帧标签
            console.log(evt.type, evt.frameLabel);
        }

        private onAnimationEvent(evt: dragonBones.AnimationEvent):void
        {
            switch(evt.type)
            {
                case dragonBones.AnimationEvent.START:
                     break;
                case dragonBones.AnimationEvent.LOOP_COMPLETE:
                     break;
                case dragonBones.AnimationEvent.COMPLETE:
                     //动画完成后销毁这个armature
                     this.removeChild(evt.armature.display);
                     dragonBones.WorldClock.clock.remove(evt.armature);
                     evt.armature.dispose();
                     break;
            }
        }

        private onSoundEvent(evt: dragonBones.SoundEvent):void
        {
            //播放声音
            var flySound:egret.Sound = RES.getRes(evt.sound);
            console.log("soundEvent",evt.sound);
        }

       </pre>
     */
    var AnimationEvent = (function (_super) {
        __extends(AnimationEvent, _super);
        /**
         * 创建一个新的 AnimationEvent 的实例
         * @param type 事件的类型
         * @param cancelable
         */
        function AnimationEvent(type, cancelable) {
            if (cancelable === void 0) { cancelable = false; }
            _super.call(this, type);
        }
        Object.defineProperty(AnimationEvent, "MOVEMENT_CHANGE", {
            /**
             * 不推荐使用.
             */
            get: function () {
                return AnimationEvent.FADE_IN;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationEvent.prototype, "movementID", {
            /**
             * 不推荐的API.
             * @member {string} dragonBones.AnimationEvent#movementID
             */
            get: function () {
                return this.animationName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationEvent.prototype, "armature", {
            /**
             * 配发出事件的骨架
             * @member {dragonBones.Armature} dragonBones.AnimationEvent#armature
             */
            get: function () {
                return (this.target);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationEvent.prototype, "animationName", {
            /**
             * 获取动画的名字
             * @returns {string}
             * @member {string} dragonBones.AnimationEvent#animationName
             */
            get: function () {
                return this.animationState.name;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 当动画缓入的时候派发
         */
        AnimationEvent.FADE_IN = "fadeIn";
        /**
         * 当动画缓出的时候派发
         */
        AnimationEvent.FADE_OUT = "fadeOut";
        /**
         * 当动画开始播放时派发
         */
        AnimationEvent.START = "start";
        /**
         * 当动画停止时派发
         */
        AnimationEvent.COMPLETE = "complete";
        /**
         * 当动画播放完一轮后派发
         */
        AnimationEvent.LOOP_COMPLETE = "loopComplete";
        /**
         * 当动画缓入完成时派发
         */
        AnimationEvent.FADE_IN_COMPLETE = "fadeInComplete";
        /**
         * 当动画缓出结束后派发
         */
        AnimationEvent.FADE_OUT_COMPLETE = "fadeOutComplete";
        return AnimationEvent;
    })(dragonBones.Event);
    dragonBones.AnimationEvent = AnimationEvent;
})(dragonBones || (dragonBones = {})); 

var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.TimelineCache
     * @classdesc
     * TimelineCache 是时间轴缓存基类存。
     * @see dragonBones.SlotTimelineCache
     * @see dragonBones.FrameCache
     * @see dragonBones.ICacheUser
     * @example
       <pre>
        //获取动画数据
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");
      
        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
      
        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[0].name;
        //从工厂里创建出Armature
        var armature:dragonBones.FastArmature = factory.buildFastArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        //把它添加到舞台上
        this.addChild(armatureDisplay);
        
        //以60fps的帧率开启动画缓存，缓存所有的动画数据
        var animationCachManager:dragonBones.AnimationCacheManager = armature.enableAnimationCache(60);
      
       //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName = armature.animation.animationList[0];
        //播放这个动画，gotoAndPlay各个参数说明
        //第一个参数 animationName {string} 指定播放动画的名称.
        //第二个参数 fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
        //第三个参数 duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
        //第四个参数 layTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
        armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);
      
        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
       </pre>
     */
    var TimelineCache = (function () {
        function TimelineCache() {
            this.frameCacheList = new Array();
        }
        TimelineCache.prototype.addFrame = function () {
        };
        TimelineCache.prototype.update = function (frameIndex) {
            if (frameIndex === void 0) { frameIndex = 0; }
            this.currentFrameCache.copy(this.frameCacheList[frameIndex]);
        };
        TimelineCache.prototype.bindCacheUser = function (cacheUser) {
            cacheUser.frameCache = this.currentFrameCache;
        };
        return TimelineCache;
    })();
    dragonBones.TimelineCache = TimelineCache;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.SlotTimelineCache
     * @classdesc
     * SlotTimelineCache 存储了Slot的时间轴缓存数据。
     * @see dragonBones.TimelineCache
     * @see dragonBones.SlotFrameCache
     * @example
       <pre>
        //获取动画数据
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");
      
        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
      
        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[0].name;
        //从工厂里创建出Armature
        var armature:dragonBones.FastArmature = factory.buildFastArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        //把它添加到舞台上
        this.addChild(armatureDisplay);
        
        //以60fps的帧率开启动画缓存，缓存所有的动画数据
        var animationCachManager:dragonBones.AnimationCacheManager = armature.enableAnimationCache(60);
      
       //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName = armature.animation.animationList[0];
        //播放这个动画，gotoAndPlay各个参数说明
        //第一个参数 animationName {string} 指定播放动画的名称.
        //第二个参数 fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
        //第三个参数 duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
        //第四个参数 layTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
        armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);
      
        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
       </pre>
     */
    var SlotTimelineCache = (function (_super) {
        __extends(SlotTimelineCache, _super);
        function SlotTimelineCache() {
            _super.call(this);
        }
        SlotTimelineCache.prototype.addFrame = function () {
            var cache = new dragonBones.SlotFrameCache();
            cache.globalTransform.copy(this.cacheGenerator.global);
            cache.globalTransformMatrix.copyFrom(this.cacheGenerator.globalTransformMatrix);
            if (this.cacheGenerator.colorChanged) {
                cache.colorTransform = dragonBones.ColorTransformUtil.cloneColor(this.cacheGenerator.colorTransform);
            }
            cache.displayIndex = this.cacheGenerator.displayIndex;
            this.frameCacheList.push(cache);
        };
        return SlotTimelineCache;
    })(dragonBones.TimelineCache);
    dragonBones.SlotTimelineCache = SlotTimelineCache;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     *
     * @example
       <pre>
        //获取动画数据
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");
      
        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
      
        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[0].name;
        //从工厂里创建出Armature
        var armature:dragonBones.FastArmature = factory.buildFastArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        //把它添加到舞台上
        this.addChild(armatureDisplay);
        
        //以60fps的帧率开启动画缓存，缓存所有的动画数据
        var animationCachManager:dragonBones.AnimationCacheManager = armature.enableAnimationCache(60);
      
       //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName = armature.animation.animationList[0];
        //播放这个动画，gotoAndPlay各个参数说明
        //第一个参数 animationName {string} 指定播放动画的名称.
        //第二个参数 fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
        //第三个参数 duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
        //第四个参数 layTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
        armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);
      
        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
       </pre>
     */
    var FrameCache = (function () {
        function FrameCache() {
            this.globalTransform = new dragonBones.DBTransform();
            this.globalTransformMatrix = new dragonBones.Matrix();
        }
        //浅拷贝提高效率
        FrameCache.prototype.copy = function (frameCache) {
            this.globalTransform = frameCache.globalTransform;
            this.globalTransformMatrix = frameCache.globalTransformMatrix;
        };
        FrameCache.prototype.clear = function () {
            this.globalTransform = FrameCache.ORIGIN_TRAMSFORM;
            this.globalTransformMatrix = FrameCache.ORIGIN_MATRIX;
        };
        FrameCache.ORIGIN_TRAMSFORM = new dragonBones.DBTransform();
        FrameCache.ORIGIN_MATRIX = new dragonBones.Matrix();
        return FrameCache;
    })();
    dragonBones.FrameCache = FrameCache;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.SlotFrameCache
     * @classdesc
     * SlotFrameCache 存储了Slot的帧缓存数据。
     * @see dragonBones.FastSlot
     * @see dragonBones.ICacheUser
     * @example
       <pre>
        //获取动画数据
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");
      
        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
      
        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[0].name;
        //从工厂里创建出Armature
        var armature:dragonBones.FastArmature = factory.buildFastArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        //把它添加到舞台上
        this.addChild(armatureDisplay);
        
        //以60fps的帧率开启动画缓存，缓存所有的动画数据
        var animationCachManager:dragonBones.AnimationCacheManager = armature.enableAnimationCache(60);
      
       //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName = armature.animation.animationList[0];
        //播放这个动画，gotoAndPlay各个参数说明
        //第一个参数 animationName {string} 指定播放动画的名称.
        //第二个参数 fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
        //第三个参数 duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
        //第四个参数 layTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
        armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);
      
        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
       </pre>
     */
    var SlotFrameCache = (function (_super) {
        __extends(SlotFrameCache, _super);
        //		public var zOrder:int;
        function SlotFrameCache() {
            _super.call(this);
            this.displayIndex = -1;
        }
        //浅拷贝提高效率
        SlotFrameCache.prototype.copy = function (frameCache) {
            _super.prototype.copy.call(this, frameCache);
            this.colorTransform = frameCache.colorTransform;
            this.displayIndex = frameCache.displayIndex;
        };
        SlotFrameCache.prototype.clear = function () {
            _super.prototype.clear.call(this);
            this.colorTransform = null;
            this.displayIndex = -1;
        };
        return SlotFrameCache;
    })(dragonBones.FrameCache);
    dragonBones.SlotFrameCache = SlotFrameCache;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.AnimationCacheManager
     * @classdesc
     * AnimationCacheManager 实例是动画缓存管理器，他可以为一个或多个同类型的Armature生成动画缓存数据，从而提高动画运行效率。
     * 目前AnimationCacheManager只支持对FastArmatrue生成缓存，以后会扩展为对任何实现ICacheableArmature接口的Armature生成缓存。
     * @see dragonBones.ICacheableArmature
     * @see dragonBones.FastArmature
     * @see dragonBones.AnimationCache
     * @see dragonBones.FrameCache
     * @example
       <pre>
        //获取动画数据
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");
      
        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
      
        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[0].name;
        //从工厂里创建出Armature
        var armature:dragonBones.FastArmature = factory.buildFastArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        //把它添加到舞台上
        this.addChild(armatureDisplay);
        
        //以60fps的帧率开启动画缓存，缓存所有的动画数据
        var animationCachManager:dragonBones.AnimationCacheManager = armature.enableAnimationCache(60);
      
       //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName = armature.animation.animationList[0];
        //播放这个动画，gotoAndPlay各个参数说明
        //第一个参数 animationName {string} 指定播放动画的名称.
        //第二个参数 fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
        //第三个参数 duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
        //第四个参数 layTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
        armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);
      
        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
       </pre>
     */
    var AnimationCacheManager = (function () {
        function AnimationCacheManager() {
            this.animationCacheDic = {};
            //		public var boneFrameCacheDic:Object = {};
            this.slotFrameCacheDic = {};
        }
        /**
         * 通过ArmatrueData创建并初始化AnimationCacheManager。
         * AnimationCacheManager的创建需要依赖ArmatrueData。
         * @param armatureData {ArmatureData} 骨架数据实例。
         * @param frameRate {number} 帧频。帧频决定生成数据缓存的采样率。
         * @see dragonBones.ArmatureData.
         */
        AnimationCacheManager.initWithArmatureData = function (armatureData, frameRate) {
            if (frameRate === void 0) { frameRate = 0; }
            var output = new AnimationCacheManager();
            output.armatureData = armatureData;
            if (frameRate <= 0) {
                var animationData = armatureData.animationDataList[0];
                if (animationData) {
                    output.frameRate = animationData.frameRate;
                }
            }
            else {
                output.frameRate = frameRate;
            }
            return output;
        };
        /**
         * 为所有动画初始化AnimationCache实例。在生成动画缓存之前需要调用这个API生成相应的AnimationCache实例
         * @see dragonBones.AnimationCache.
         */
        AnimationCacheManager.prototype.initAllAnimationCache = function () {
            var length = this.armatureData.animationDataList.length;
            for (var i = 0; i < length; i++) {
                var animationData = this.armatureData.animationDataList[i];
                this.animationCacheDic[animationData.name] = dragonBones.AnimationCache.initWithAnimationData(animationData, this.armatureData);
            }
        };
        /**
         * 指定动画名，初始化AnimationCache实例。在生成动画缓存之前需要调用这个API生成相应的AnimationCache实例
         * @param animationName {string} 动画名。
         * @see dragonBones.AnimationCache.
         */
        AnimationCacheManager.prototype.initAnimationCache = function (animationName) {
            this.animationCacheDic[animationName] = dragonBones.AnimationCache.initWithAnimationData(this.armatureData.getAnimationData(animationName), this.armatureData);
        };
        /**
         * 绑定Armature列表做为动画缓存的使用者。
         * 在为Armature生成动画缓存之前，需要将其绑定为动画缓存的使用者
         * @param armatures {Array<any>} 骨架列表。
         * @see dragonBones.ICacheableArmature.
         */
        AnimationCacheManager.prototype.bindCacheUserArmatures = function (armatures) {
            var length = armatures.length;
            for (var i = 0; i < length; i++) {
                var armature = armatures[i];
                this.bindCacheUserArmature(armature);
            }
        };
        /**
         * 绑定制定Armature做为动画缓存的使用者。
         * 在为Armature生成动画缓存之前，需要将其绑定为动画缓存的使用者
         * @param armatures {FastArmature} 要绑定为缓存使用者的骨架对象。
         * @see dragonBones.ICacheableArmature.
         */
        AnimationCacheManager.prototype.bindCacheUserArmature = function (armature) {
            armature.animation.animationCacheManager = this;
            var cacheUser;
            //			for each(cacheUser in armature._boneDic)
            //			{
            //				cacheUser.frameCache = boneFrameCacheDic[cacheUser.name];
            //			}
            for (var k in armature._slotDic) {
                cacheUser = armature._slotDic[k];
                cacheUser.frameCache = this.slotFrameCacheDic[cacheUser.name];
            }
            /*
            var length:number = armature._slotDic.length;
            for(var i:number = 0;i < length;i++){
                cacheUser = armature._slotDic[i];
                cacheUser.frameCache = this.slotFrameCacheDic[cacheUser.name];
            }
            */
        };
        /**
         * 设置指定的Armature做为动画缓存的生成器。（同一个Armature可以既是缓存使用者，也是缓存生成器）
         * 在为Armature生成动画缓存之前，需要设置动画缓存的生成器
         * @param armatures {FastArmature} 要设置为缓存生成器的骨架对象。
         * @see dragonBones.ICacheableArmature.
         */
        AnimationCacheManager.prototype.setCacheGeneratorArmature = function (armature) {
            this.cacheGeneratorArmature = armature;
            var cacheUser;
            //			for each(cacheUser in armature._boneDic)
            //			{
            //				boneFrameCacheDic[cacheUser.name] = new FrameCache();
            //			}
            for (var slot in armature._slotDic) {
                cacheUser = armature._slotDic[slot];
                this.slotFrameCacheDic[cacheUser.name] = new dragonBones.SlotFrameCache();
            }
            /*
            var length:number = armature._slotDic.length;
            for(var i:number = 0;i < length;i++){
                cacheUser = armature._slotDic[i];
                this.slotFrameCacheDic[cacheUser.name] = new SlotFrameCache();
            }
            */
            for (var anim in this.animationCacheDic) {
                var animationCache = this.animationCacheDic[anim];
                animationCache.initSlotTimelineCacheDic(armature._slotDic, this.slotFrameCacheDic);
            }
            /*
            var length1:number = this.animationCacheDic.length;
            for(var i1:number = 0;i1 < length1;i1++){
                var animationCache:AnimationCache = this.animationCacheDic[i1];
//				animationCache.initBoneTimelineCacheDic(armature._boneDic, boneFrameCacheDic);
                animationCache.initSlotTimelineCacheDic(armature._slotDic, this.slotFrameCacheDic);
            }
            */
        };
        /**
         * 生成所有动画缓存数据。生成之后，所有绑定CacheUser的Armature就都能够使用这些缓存了。
         * 在为调用这个API生成动画缓存之前，需要：
         * 1.调用API initAllAnimationCache 初始化AnimationCache实例
         * 2.调用API setCacheGeneratorArmature 设置动画缓存的生成器,
         * 3.调用API bindCacheUserArmatures 绑定动画缓存的使用者
         * @param loop {boolean} 要生成缓存的动画是否需要循环播放。如果该动画在播放时只需要播放一次，则设置为false。如果需要播放大于一次，则设置为true。
         * @see dragonBones.AnimationCache
         */
        AnimationCacheManager.prototype.generateAllAnimationCache = function (loop) {
            /*
            var length:number = this.animationCacheDic.length;
            for(var i:number = 0;i < length;i++){
                var animationCache:AnimationCache = this.animationCacheDic[i];
                this.generateAnimationCache(animationCache.name);
            }
            */
            for (var anim in this.animationCacheDic) {
                var animationCache = this.animationCacheDic[anim];
                this.generateAnimationCache(animationCache.name, loop);
            }
        };
        /**
         * 生成指定动画缓存数据。生成之后，所有绑定CacheUser的Armature就都能够使用这些缓存了。
         * 在为调用这个API生成动画缓存之前，需要：
         * 1.调用API initAnimationCache 初始化AnimationCache实例
         * 2.调用API setCacheGeneratorArmature 设置动画缓存的生成器,
         * 3.调用API bindCacheUserArmatures 绑定动画缓存的使用者
         * @param animationName {string} 要生成缓存的动画名。
         * @param loop {boolean} 要生成缓存的动画是否需要循环播放。如果该动画在播放时只需要播放一次，则设置为false。如果需要播放大于一次，则设置为true。
         * @see dragonBones.AnimationCache
         */
        AnimationCacheManager.prototype.generateAnimationCache = function (animationName, loop) {
            var temp = this.cacheGeneratorArmature.enableCache;
            this.cacheGeneratorArmature.enableCache = false;
            var animationCache = this.animationCacheDic[animationName];
            if (!animationCache) {
                return;
            }
            var animationState = this.cacheGeneratorArmature.getAnimation().animationState;
            var passTime = 1 / this.frameRate;
            if (loop) {
                this.cacheGeneratorArmature.getAnimation().gotoAndPlay(animationName, 0, -1, 0);
            }
            else {
                this.cacheGeneratorArmature.getAnimation().gotoAndPlay(animationName, 0, -1, 1);
            }
            var tempEnableEventDispatch = this.cacheGeneratorArmature.enableEventDispatch;
            this.cacheGeneratorArmature.enableEventDispatch = false;
            var lastProgress;
            do {
                lastProgress = animationState.progress;
                this.cacheGeneratorArmature.advanceTime(passTime);
                animationCache.addFrame();
            } while (animationState.progress >= lastProgress && animationState.progress < 1);
            this.cacheGeneratorArmature.enableEventDispatch = tempEnableEventDispatch;
            this.resetCacheGeneratorArmature();
            this.cacheGeneratorArmature.enableCache = temp;
        };
        /**
         * 将缓存生成器骨架重置，生成动画缓存后调用。
         * @see dragonBones.ICacheableArmature
         */
        AnimationCacheManager.prototype.resetCacheGeneratorArmature = function () {
            this.cacheGeneratorArmature.resetAnimation();
        };
        /**
         * 获取制定名称的AnimationCache实例。
         * @param animationName {string} 动画名。
         * @see dragonBones.AnimationCache
         */
        AnimationCacheManager.prototype.getAnimationCache = function (animationName) {
            return this.animationCacheDic[animationName];
        };
        return AnimationCacheManager;
    })();
    dragonBones.AnimationCacheManager = AnimationCacheManager;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.AnimationCache
     * @classdesc
     * AnimationCache 实例是动画缓存的实体，包含一个动画的所有缓存数据。
     * 每个Slot的缓存数据存在各个SlotTimelineCache中。
     * 一般来说 AnimationCache 不需要开发者直接操控，而是由AnimationCacheManager代为管理。
     * @see dragonBones.AnimationCacheManager
     * @see dragonBones.TimelineCache
     * @see dragonBones.SlotTimelineCache
     * @see dragonBones.SlotFrameCache
     * @example
       <pre>
        //获取动画数据
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");
      
        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
      
        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[0].name;
        //从工厂里创建出Armature
        var armature:dragonBones.FastArmature = factory.buildFastArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        //把它添加到舞台上
        this.addChild(armatureDisplay);
        
        //以60fps的帧率开启动画缓存，缓存所有的动画数据
        var animationCachManager:dragonBones.AnimationCacheManager = armature.enableAnimationCache(60);
      
        //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName = armature.animation.animationList[0];
        //播放这个动画，gotoAndPlay各个参数说明
        //第一个参数 animationName {string} 指定播放动画的名称.
        //第二个参数 fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
        //第三个参数 duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
        //第四个参数 layTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
        armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);
      
        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
        </pre>
     */
    var AnimationCache = (function () {
        function AnimationCache() {
            //		public var boneTimelineCacheList:Vector.<BoneTimelineCache> = new Vector.<BoneTimelineCache>();
            this.slotTimelineCacheList = [];
            //		public var boneTimelineCacheDic:Object = {};
            this.slotTimelineCacheDic = {};
            this.frameNum = 0;
        }
        AnimationCache.initWithAnimationData = function (animationData, armatureData) {
            var output = new AnimationCache();
            output.name = animationData.name;
            var boneTimelineList = animationData.timelineList;
            var boneName;
            var boneData;
            var slotData;
            var slotTimelineCache;
            var slotName;
            for (var i = 0, length = boneTimelineList.length; i < length; i++) {
                boneName = boneTimelineList[i].name;
                for (var j = 0, jlen = armatureData.slotDataList.length; j < jlen; j++) {
                    slotData = armatureData.slotDataList[j];
                    slotName = slotData.name;
                    if (slotData.parent == boneName) {
                        if (output.slotTimelineCacheDic[slotName] == null) {
                            slotTimelineCache = new dragonBones.SlotTimelineCache();
                            slotTimelineCache.name = slotName;
                            output.slotTimelineCacheList.push(slotTimelineCache);
                            output.slotTimelineCacheDic[slotName] = slotTimelineCache;
                        }
                    }
                }
            }
            return output;
        };
        //		public function initBoneTimelineCacheDic(boneCacheGeneratorDic:Object, boneFrameCacheDic:Object):void
        //		{
        //			var name:String;
        //			for each(var boneTimelineCache:BoneTimelineCache in boneTimelineCacheDic)
        //			{
        //				name = boneTimelineCache.name;
        //				boneTimelineCache.cacheGenerator = boneCacheGeneratorDic[name];
        //				boneTimelineCache.currentFrameCache = boneFrameCacheDic[name];
        //			}
        //		}
        AnimationCache.prototype.initSlotTimelineCacheDic = function (slotCacheGeneratorDic, slotFrameCacheDic) {
            var name;
            for (var k in this.slotTimelineCacheDic) {
                var slotTimelineCache = this.slotTimelineCacheDic[k];
                name = slotTimelineCache.name;
                slotTimelineCache.cacheGenerator = slotCacheGeneratorDic[name];
                slotTimelineCache.currentFrameCache = slotFrameCacheDic[name];
            }
        };
        //		public function bindCacheUserBoneDic(boneDic:Object):void
        //		{
        //			for(var name:String in boneDic)
        //			{
        //				(boneTimelineCacheDic[name] as BoneTimelineCache).bindCacheUser(boneDic[name]);
        //			}
        //		}
        AnimationCache.prototype.bindCacheUserSlotDic = function (slotDic) {
            for (var name in slotDic) {
                (this.slotTimelineCacheDic[name]).bindCacheUser(slotDic[name]);
            }
        };
        AnimationCache.prototype.addFrame = function () {
            this.frameNum++;
            //			var boneTimelineCache:BoneTimelineCache;
            //			for(var i:int = 0, length:int = boneTimelineCacheList.length; i < length; i++)
            //			{
            //				boneTimelineCache = boneTimelineCacheList[i];
            //				boneTimelineCache.addFrame();
            //			}
            var slotTimelineCache;
            for (var i = 0, length = this.slotTimelineCacheList.length; i < length; i++) {
                slotTimelineCache = this.slotTimelineCacheList[i];
                slotTimelineCache.addFrame();
            }
        };
        AnimationCache.prototype.update = function (progress) {
            var frameIndex = Math.floor(progress * (this.frameNum - 1));
            //			var boneTimelineCache:BoneTimelineCache;
            //			for(var i:int = 0, length:int = boneTimelineCacheList.length; i < length; i++)
            //			{
            //				boneTimelineCache = boneTimelineCacheList[i];
            //				boneTimelineCache.update(frameIndex);
            //			}
            var slotTimelineCache;
            for (var i = 0, length = this.slotTimelineCacheList.length; i < length; i++) {
                slotTimelineCache = this.slotTimelineCacheList[i];
                slotTimelineCache.update(frameIndex);
            }
        };
        return AnimationCache;
    })();
    dragonBones.AnimationCache = AnimationCache;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.DBObject
     * @classdesc
     * DBObject 是 Bone 和 Slot 的基类
     * @see dragonBones.Bone
     * @see dragonBones.Slot
     */
    var DBObject = (function () {
        function DBObject() {
            this._globalTransformMatrix = new dragonBones.Matrix();
            this._global = new dragonBones.DBTransform();
            this._origin = new dragonBones.DBTransform();
            this._offset = new dragonBones.DBTransform();
            this._offset.scaleX = this._offset.scaleY = 1;
            this._visible = true;
            this._armature = null;
            this._parent = null;
            this.userData = null;
            this.inheritRotation = true;
            this.inheritScale = true;
            this.inheritTranslation = true;
        }
        Object.defineProperty(DBObject.prototype, "global", {
            /**
             * 相对世界坐标的 DBTransform 实例。
             * @member {DBTransform} dragonBones.DBObject#global
             */
            get: function () {
                return this._global;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DBObject.prototype, "origin", {
            /**
             * 骨架数据中的原始的相对父亲的 DBTransform 实例。
             * @member {DBTransform} dragonBones.DBObject#origin
             */
            get: function () {
                return this._origin;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DBObject.prototype, "offset", {
            /**
             * 用于运行时动态调整的 DBTransform 实例。
             * @member {DBTransform} dragonBones.DBObject#offset
             */
            get: function () {
                return this._offset;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DBObject.prototype, "armature", {
            /**
             * The armature this DBObject instance belongs to.
             */
            get: function () {
                return this._armature;
            },
            enumerable: true,
            configurable: true
        });
        /** @private */
        DBObject.prototype._setArmature = function (value) {
            this._armature = value;
        };
        Object.defineProperty(DBObject.prototype, "parent", {
            /**
             * Indicates the Bone instance that directly contains this DBObject instance if any.
             */
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        /** @private */
        DBObject.prototype._setParent = function (value) {
            this._parent = value;
        };
        /**
         * 清理使用的资源用于垃圾回收
         */
        DBObject.prototype.dispose = function () {
            this.userData = null;
            this._globalTransformMatrix = null;
            this._global = null;
            this._origin = null;
            this._offset = null;
            this._armature = null;
            this._parent = null;
        };
        DBObject.prototype._calculateRelativeParentTransform = function () {
        };
        DBObject.prototype._calculateParentTransform = function () {
            if (this.parent && (this.inheritTranslation || this.inheritRotation || this.inheritScale)) {
                var parentGlobalTransform = this._parent._globalTransformForChild;
                var parentGlobalTransformMatrix = this._parent._globalTransformMatrixForChild;
                if (!this.inheritTranslation || !this.inheritRotation || !this.inheritScale) {
                    parentGlobalTransform = DBObject._tempParentGlobalTransform;
                    parentGlobalTransform.copy(this._parent._globalTransformForChild);
                    if (!this.inheritTranslation) {
                        parentGlobalTransform.x = 0;
                        parentGlobalTransform.y = 0;
                    }
                    if (!this.inheritScale) {
                        parentGlobalTransform.scaleX = 1;
                        parentGlobalTransform.scaleY = 1;
                    }
                    if (!this.inheritRotation) {
                        parentGlobalTransform.skewX = 0;
                        parentGlobalTransform.skewY = 0;
                    }
                    parentGlobalTransformMatrix = DBObject._tempParentGlobalTransformMatrix;
                    dragonBones.TransformUtil.transformToMatrix(parentGlobalTransform, parentGlobalTransformMatrix, true);
                }
                return { parentGlobalTransform: parentGlobalTransform, parentGlobalTransformMatrix: parentGlobalTransformMatrix };
            }
            return null;
        };
        DBObject.prototype._updateGlobal = function () {
            this._calculateRelativeParentTransform();
            var output = this._calculateParentTransform();
            if (output != null) {
                //计算父骨头绝对坐标
                var parentMatrix = output.parentGlobalTransformMatrix;
                var parentGlobalTransform = output.parentGlobalTransform;
                //计算绝对坐标
                var x = this._global.x;
                var y = this._global.y;
                this._global.x = parentMatrix.a * x + parentMatrix.c * y + parentMatrix.tx;
                this._global.y = parentMatrix.d * y + parentMatrix.b * x + parentMatrix.ty;
                if (this.inheritRotation) {
                    this._global.skewX += parentGlobalTransform.skewX;
                    this._global.skewY += parentGlobalTransform.skewY;
                }
                if (this.inheritScale) {
                    this._global.scaleX *= parentGlobalTransform.scaleX;
                    this._global.scaleY *= parentGlobalTransform.scaleY;
                }
            }
            dragonBones.TransformUtil.transformToMatrix(this._global, this._globalTransformMatrix, true);
            return output;
        };
        DBObject._tempParentGlobalTransformMatrix = new dragonBones.Matrix();
        DBObject._tempParentGlobalTransform = new dragonBones.DBTransform();
        return DBObject;
    })();
    dragonBones.DBObject = DBObject;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.Slot
     * @classdesc
     * Slot 实例是骨头上的一个插槽，是显示图片的容器。
     * 一个 Bone 上可以有多个Slot，每个Slot中同一时间都会有一张图片用于显示，不同的Slot中的图片可以同时显示。
     * 每个 Slot 中可以包含多张图片，同一个 Slot 中的不同图片不能同时显示，但是可以在动画进行的过程中切换，用于实现帧动画。
     * @extends dragonBones.DBObject
     * @see dragonBones.Armature
     * @see dragonBones.Bone
     * @see dragonBones.SlotData
     *
     * @example
       <pre>
        //获取动画数据 本例使用Knight例子.
        //资源下载地址http://dragonbones.github.io/download_forwarding.html?download_url=downloads/dragonbonesdemos_v2.4.zip
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");
        //这个资源需要自己准备
        var horseHat = RES.getRes("horseHat");
        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));

        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[1].name;
        //从工厂里创建出Armature
        var armature:dragonBones.Armature = factory.buildArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        //把它添加到舞台上
        armatureDisplay.x = 200;
        armatureDisplay.y = 300;
        this.addChild(armatureDisplay);

        //以下四句代码，实现给骨骼添加slot的功能
        //1.获取马头的骨骼
        var horseHead:dragonBones.Bone = armature.getBone("horseHead");
        //2.创建一个slot
        var horseHatSlot:dragonBones.EgretSlot = new dragonBones.EgretSlot();
        //3.给这个slot赋一个图片
        horseHatSlot.display = new egret.Bitmap(horseHat);
        //4.把这个slot添加到骨骼上
        horseHead.addSlot(horseHatSlot);

        //以下3句代码，实现了子骨骼的获取和播放子骨架的动画
        //1.获取包含子骨架的骨骼
        var weaponBone:dragonBones.Bone = armature.getBone("armOutside");
        //2.获取骨骼上的子骨架
        var childArmature:dragonBones.Armature = weaponBone.childArmature;
        //3.播放子骨架的动画
        childArmature.animation.gotoAndPlay("attack_sword_1",0,-1,0);


        //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName = armature.animation.animationList[0];
        armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);

        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
       </pre>
     */
    var Slot = (function (_super) {
        __extends(Slot, _super);
        function Slot(self) {
            _super.call(this);
            this._currentDisplayIndex = 0;
            if (self != this) {
                throw new Error(egret.getString(4001));
            }
            this._displayList = [];
            this._timelineStateList = [];
            this._currentDisplayIndex = -1;
            this._originZOrder = 0;
            this._tweenZOrder = 0;
            this._offsetZOrder = 0;
            this._isShowDisplay = false;
            this._colorTransform = new dragonBones.ColorTransform();
            this._displayDataList = null;
            //_childArmature = null;
            this._currentDisplay = null;
            this.inheritRotation = true;
            this.inheritScale = true;
        }
        /**
         * 通过传入 SlotData 初始化Slot
         * @param slotData
         */
        Slot.prototype.initWithSlotData = function (slotData) {
            this.name = slotData.name;
            this.blendMode = slotData.blendMode;
            this._originZOrder = slotData.zOrder;
            this._displayDataList = slotData.displayDataList;
            this._originDisplayIndex = slotData.displayIndex;
        };
        /**
         * @inheritDoc
         */
        Slot.prototype.dispose = function () {
            if (!this._displayList) {
                return;
            }
            _super.prototype.dispose.call(this);
            this._displayList.length = 0;
            this._displayDataList = null;
            this._displayList = null;
            this._currentDisplay = null;
            //_childArmature = null;
        };
        Slot.prototype.sortState = function (state1, state2) {
            return state1._animationState.layer < state2._animationState.layer ? -1 : 1;
        };
        /** @private */
        Slot.prototype._addState = function (timelineState) {
            if (this._timelineStateList.indexOf(timelineState) < 0) {
                this._timelineStateList.push(timelineState);
                this._timelineStateList.sort(this.sortState);
            }
        };
        /** @private */
        Slot.prototype._removeState = function (timelineState) {
            var index = this._timelineStateList.indexOf(timelineState);
            if (index >= 0) {
                this._timelineStateList.splice(index, 1);
            }
        };
        //骨架装配
        /** @private */
        Slot.prototype.setArmature = function (value) {
            if (this._armature == value) {
                return;
            }
            if (this._armature) {
                this._armature._removeSlotFromSlotList(this);
            }
            this._armature = value;
            if (this._armature) {
                this._armature._addSlotToSlotList(this);
                this._armature._slotsZOrderChanged = true;
                this._addDisplayToContainer(this._armature.display);
            }
            else {
                this._removeDisplayFromContainer();
            }
        };
        //动画
        /** @private */
        Slot.prototype._update = function () {
            if (this._parent._needUpdate <= 0 && !this._needUpdate) {
                return;
            }
            this._updateGlobal();
            this._updateTransform();
            this._needUpdate = false;
        };
        Slot.prototype._calculateRelativeParentTransform = function () {
            this._global.scaleX = this._origin.scaleX * this._offset.scaleX;
            this._global.scaleY = this._origin.scaleY * this._offset.scaleY;
            this._global.skewX = this._origin.skewX + this._offset.skewX;
            this._global.skewY = this._origin.skewY + this._offset.skewY;
            this._global.x = this._origin.x + this._offset.x + this._parent._tweenPivot.x;
            this._global.y = this._origin.y + this._offset.y + this._parent._tweenPivot.y;
        };
        Slot.prototype.updateChildArmatureAnimation = function () {
            if (this.childArmature) {
                if (this._isShowDisplay) {
                    if (this._armature &&
                        this._armature.animation.lastAnimationState &&
                        this.childArmature.animation.hasAnimation(this._armature.animation.lastAnimationState.name)) {
                        this.childArmature.animation.gotoAndPlay(this._armature.animation.lastAnimationState.name);
                    }
                    else {
                        this.childArmature.animation.play();
                    }
                }
                else {
                    this.childArmature.animation.stop();
                    this.childArmature.animation._lastAnimationState = null;
                }
            }
        };
        /** @private */
        Slot.prototype._changeDisplay = function (displayIndex) {
            if (displayIndex === void 0) { displayIndex = 0; }
            if (displayIndex < 0) {
                if (this._isShowDisplay) {
                    this._isShowDisplay = false;
                    this._removeDisplayFromContainer();
                    this.updateChildArmatureAnimation();
                }
            }
            else if (this._displayList.length > 0) {
                var length = this._displayList.length;
                if (displayIndex >= length) {
                    displayIndex = length - 1;
                }
                if (this._currentDisplayIndex != displayIndex) {
                    this._isShowDisplay = true;
                    this._currentDisplayIndex = displayIndex;
                    this._updateSlotDisplay();
                    this.updateChildArmatureAnimation();
                    if (this._displayDataList &&
                        this._displayDataList.length > 0 &&
                        this._currentDisplayIndex < this._displayDataList.length) {
                        this._origin.copy(this._displayDataList[this._currentDisplayIndex].transform);
                    }
                    this._needUpdate = true;
                }
                else if (!this._isShowDisplay) {
                    this._isShowDisplay = true;
                    if (this._armature) {
                        this._armature._slotsZOrderChanged = true;
                        this._addDisplayToContainer(this._armature.display);
                    }
                    this.updateChildArmatureAnimation();
                }
            }
        };
        /** @private
         * Updates the display of the slot.
         */
        Slot.prototype._updateSlotDisplay = function () {
            var currentDisplayIndex = -1;
            if (this._currentDisplay) {
                currentDisplayIndex = this._getDisplayIndex();
                this._removeDisplayFromContainer();
            }
            var displayObj = this._displayList[this._currentDisplayIndex];
            if (displayObj) {
                if (displayObj instanceof dragonBones.Armature) {
                    //_childArmature = display as Armature;
                    this._currentDisplay = displayObj.display;
                }
                else {
                    //_childArmature = null;
                    this._currentDisplay = displayObj;
                }
            }
            else {
                this._currentDisplay = null;
            }
            this._updateDisplay(this._currentDisplay);
            if (this._currentDisplay) {
                if (this._armature && this._isShowDisplay) {
                    if (currentDisplayIndex < 0) {
                        this._armature._slotsZOrderChanged = true;
                        this._addDisplayToContainer(this._armature.display);
                    }
                    else {
                        this._addDisplayToContainer(this._armature.display, currentDisplayIndex);
                    }
                }
                this._updateDisplayBlendMode(this._blendMode);
                this._updateDisplayColor(this._colorTransform.alphaOffset, this._colorTransform.redOffset, this._colorTransform.greenOffset, this._colorTransform.blueOffset, this._colorTransform.alphaMultiplier, this._colorTransform.redMultiplier, this._colorTransform.greenMultiplier, this._colorTransform.blueMultiplier);
                this._updateDisplayVisible(this._visible);
                this._updateTransform();
            }
        };
        Object.defineProperty(Slot.prototype, "visible", {
            /** @private */
            set: function (value) {
                if (this._visible != value) {
                    this._visible = value;
                    this._updateDisplayVisible(this._visible);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slot.prototype, "displayList", {
            /**
             * 显示对象列表(包含 display 或者 子骨架)
             * @member {any[]} dragonBones.Slot#displayList
             */
            get: function () {
                return this._displayList;
            },
            set: function (value) {
                if (!value) {
                    throw new Error();
                }
                //为什么要修改_currentDisplayIndex?
                if (this._currentDisplayIndex < 0) {
                    this._currentDisplayIndex = 0;
                }
                var i = this._displayList.length = value.length;
                while (i--) {
                    this._displayList[i] = value[i];
                }
                //在index不改变的情况下强制刷新 TO DO需要修改
                var displayIndexBackup = this._currentDisplayIndex;
                this._currentDisplayIndex = -1;
                this._changeDisplay(displayIndexBackup);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slot.prototype, "display", {
            /**
             * 当前的显示对象(可能是 display 或者 子骨架)
             * @member {any} dragonBones.Slot#display
             */
            get: function () {
                return this._currentDisplay;
            },
            set: function (value) {
                if (this._currentDisplayIndex < 0) {
                    this._currentDisplayIndex = 0;
                }
                if (this._displayList[this._currentDisplayIndex] == value) {
                    return;
                }
                this._displayList[this._currentDisplayIndex] = value;
                this._updateSlotDisplay();
                this.updateChildArmatureAnimation();
                this._updateTransform(); //是否可以延迟更新？
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 不推荐的 API. 使用 display 属性代替
         */
        Slot.prototype.getDisplay = function () {
            return this.display;
        };
        /**
         * Unrecommended API. Please use .display = instead.
         * @returns {any}
         */
        Slot.prototype.setDisplay = function (value) {
            this.display = value;
        };
        Object.defineProperty(Slot.prototype, "childArmature", {
            /**
             * 当前的子骨架
             * @member {Armature} dragonBones.Slot#childArmature
             */
            get: function () {
                if (this._displayList[this._currentDisplayIndex] instanceof dragonBones.Armature) {
                    return (this._displayList[this._currentDisplayIndex]);
                }
                return null;
            },
            set: function (value) {
                //设计的不好，要修改
                this.display = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slot.prototype, "zOrder", {
            /**
             * 显示顺序。(支持小数用于实现动态插入slot)
             * @member {number} dragonBones.Slot#zOrder
             */
            get: function () {
                return this._originZOrder + this._tweenZOrder + this._offsetZOrder;
            },
            set: function (value) {
                if (this.zOrder != value) {
                    this._offsetZOrder = value - this._originZOrder - this._tweenZOrder;
                    if (this._armature) {
                        this._armature._slotsZOrderChanged = true;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slot.prototype, "blendMode", {
            /**
             * 混合模式
             * @member {string} dragonBones.Slot#blendMode
             */
            get: function () {
                return this._blendMode;
            },
            set: function (value) {
                if (this._blendMode != value) {
                    this._blendMode = value;
                    this._updateDisplayBlendMode(this._blendMode);
                }
            },
            enumerable: true,
            configurable: true
        });
        //Abstract method
        /**
         * @private
         */
        Slot.prototype._updateDisplay = function (value) {
            throw new Error("");
        };
        /**
         * @private
         */
        Slot.prototype._getDisplayIndex = function () {
            throw new Error(egret.getString(4001));
        };
        /**
         * @private
         * Adds the original display object to another display object.
         * @param container
         * @param index
         */
        Slot.prototype._addDisplayToContainer = function (container, index) {
            if (index === void 0) { index = -1; }
            throw new Error(egret.getString(4001));
        };
        /**
         * @private
         * remove the original display object from its parent.
         */
        Slot.prototype._removeDisplayFromContainer = function () {
            throw new Error(egret.getString(4001));
        };
        /**
         * @private
         * Updates the transform of the slot.
         */
        Slot.prototype._updateTransform = function () {
            throw new Error(egret.getString(4001));
        };
        /**
         * @private
         */
        Slot.prototype._updateDisplayVisible = function (value) {
            /**
             * bone.visible && slot.visible && updateVisible
             * this._parent.visible && this._visible && value;
             */
            throw new Error(egret.getString(4001));
        };
        /**
         * @private
         * Updates the color of the display object.
         * @param a
         * @param r
         * @param g
         * @param b
         * @param aM
         * @param rM
         * @param gM
         * @param bM
         */
        Slot.prototype._updateDisplayColor = function (aOffset, rOffset, gOffset, bOffset, aMultiplier, rMultiplier, gMultiplier, bMultiplier, colorChanged) {
            if (colorChanged === void 0) { colorChanged = false; }
            this._colorTransform.alphaOffset = aOffset;
            this._colorTransform.redOffset = rOffset;
            this._colorTransform.greenOffset = gOffset;
            this._colorTransform.blueOffset = bOffset;
            this._colorTransform.alphaMultiplier = aMultiplier;
            this._colorTransform.redMultiplier = rMultiplier;
            this._colorTransform.greenMultiplier = gMultiplier;
            this._colorTransform.blueMultiplier = bMultiplier;
            this._isColorChanged = colorChanged;
        };
        /**
         * @private
         * Update the blend mode of the display object.
         * @param value The blend mode to use.
         */
        Slot.prototype._updateDisplayBlendMode = function (value) {
            throw new Error("Abstract method needs to be implemented in subclass!");
        };
        /** @private When bone timeline enter a key frame, call this func*/
        Slot.prototype._arriveAtFrame = function (frame, timelineState, animationState, isCross) {
            var displayControl = animationState.displayControl &&
                animationState.containsBoneMask(this.parent.name);
            if (displayControl) {
                var slotFrame = frame;
                var displayIndex = slotFrame.displayIndex;
                var childSlot;
                this._changeDisplay(displayIndex);
                this._updateDisplayVisible(slotFrame.visible);
                if (displayIndex >= 0) {
                    if (!isNaN(slotFrame.zOrder) && slotFrame.zOrder != this._tweenZOrder) {
                        this._tweenZOrder = slotFrame.zOrder;
                        this._armature._slotsZOrderChanged = true;
                    }
                }
                //[TODO]currently there is only gotoAndPlay belongs to frame action. In future, there will be more.
                //后续会扩展更多的action，目前只有gotoAndPlay的含义
                if (frame.action) {
                    if (this.childArmature) {
                        this.childArmature.animation.gotoAndPlay(frame.action);
                    }
                }
            }
        };
        Slot.prototype._updateGlobal = function () {
            this._calculateRelativeParentTransform();
            dragonBones.TransformUtil.transformToMatrix(this._global, this._globalTransformMatrix, true);
            var output = this._calculateParentTransform();
            if (output) {
                this._globalTransformMatrix.concat(output.parentGlobalTransformMatrix);
                dragonBones.TransformUtil.matrixToTransform(this._globalTransformMatrix, this._global, this._global.scaleX * output.parentGlobalTransform.scaleX >= 0, this._global.scaleY * output.parentGlobalTransform.scaleY >= 0);
            }
            return output;
        };
        Slot.prototype._resetToOrigin = function () {
            this._changeDisplay(this._originDisplayIndex);
            this._updateDisplayColor(0, 0, 0, 0, 1, 1, 1, 1, true);
        };
        return Slot;
    })(dragonBones.DBObject);
    dragonBones.Slot = Slot;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.Bone
     * @classdesc
     * Bone 实例代表 Armature 中的一个骨头。一个Armature实例可以由很多 Bone组成。
     * Bone 在骨骼动画体系中是最重要的逻辑单元之一，负责动画中的平移旋转缩放的实现
     * @extends dragonBones.DBObject
     * @see dragonBones.Armature
     * @see dragonBones.Slot
     * @see dragonBones.BoneData
     *
     * @example
       <pre>
        //获取动画数据 本例使用Knight例子.
        //资源下载地址http://dragonbones.github.io/download_forwarding.html?download_url=downloads/dragonbonesdemos_v2.4.zip
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");
        //这个资源需要自己准备
        var horseHat = RES.getRes("horseHat");
        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));

        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[1].name;
        //从工厂里创建出Armature
        var armature:dragonBones.Armature = factory.buildArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        //把它添加到舞台上
        armatureDisplay.x = 200;
        armatureDisplay.y = 300;
        this.addChild(armatureDisplay);

        //以下四句代码，实现给骨骼添加slot的功能
        //1.获取马头的骨骼
        var horseHead:dragonBones.Bone = armature.getBone("horseHead");
        //2.创建一个slot
        var horseHatSlot:dragonBones.EgretSlot = new dragonBones.EgretSlot();
        //3.给这个slot赋一个图片
        horseHatSlot.display = new egret.Bitmap(horseHat);
        //4.把这个slot添加到骨骼上
        horseHead.addSlot(horseHatSlot);

        //以下3句代码，实现了子骨骼的获取和播放子骨架的动画
        //1.获取包含子骨架的骨骼
        var weaponBone:dragonBones.Bone = armature.getBone("armOutside");
        //2.获取骨骼上的子骨架
        var childArmature:dragonBones.Armature = weaponBone.childArmature;
        //3.播放子骨架的动画
        childArmature.animation.gotoAndPlay("attack_sword_1",0,-1,0);


        //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName = armature.animation.animationList[0];
        armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);

        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
       </pre>
     */
    var Bone = (function (_super) {
        __extends(Bone, _super);
        function Bone() {
            _super.call(this);
            /**
             * 标记是否将offset中的平移分量作用到子骨头
             * 默认值：true
             * @member {true} dragonBones.Bone#applyOffsetTranslationToChild
             * @see dragonBones.Bone#offset
             */
            this.applyOffsetTranslationToChild = true;
            /**
             * 标记是否将offset中的旋转分量作用到子骨头
             * 默认值：true
             * @member {true} dragonBones.Bone#applyOffsetRotationToChild
             * @see dragonBones.Bone#offset
             */
            this.applyOffsetRotationToChild = true;
            /**
             * 标记是否将offset中的缩放分量作用到子骨头
             * 默认值：true
             * @member {true} dragonBones.Bone#applyOffsetScaleToChild
             * @see dragonBones.Bone#offset
             */
            this.applyOffsetScaleToChild = false;
            /** @private */
            this._needUpdate = 0;
            this._tween = new dragonBones.DBTransform();
            this._tweenPivot = new dragonBones.Point();
            this._tween.scaleX = this._tween.scaleY = 1;
            this._boneList = [];
            this._slotList = [];
            this._timelineStateList = [];
            this._needUpdate = 2;
            this._isColorChanged = false;
        }
        Bone.initWithBoneData = function (boneData) {
            var outputBone = new Bone();
            outputBone.name = boneData.name;
            outputBone.inheritRotation = boneData.inheritRotation;
            outputBone.inheritScale = boneData.inheritScale;
            outputBone.origin.copy(boneData.transform);
            return outputBone;
        };
        /**
         * @inheritDoc
         */
        Bone.prototype.dispose = function () {
            if (!this._boneList) {
                return;
            }
            _super.prototype.dispose.call(this);
            var i = this._boneList.length;
            while (i--) {
                this._boneList[i].dispose();
            }
            i = this._slotList.length;
            while (i--) {
                this._slotList[i].dispose();
            }
            this._tween = null;
            this._tweenPivot = null;
            this._boneList = null;
            this._slotList = null;
            this._timelineStateList = null;
        };
        //骨架装配
        /**
         * 检查是否包含指定的 Bone 或者 Slot
         * @param child {DBObject} Bone 实例 或者 Slot 实例
         * @returns {boolean}
         */
        Bone.prototype.contains = function (child) {
            if (!child) {
                throw new Error();
            }
            if (child == this) {
                return false;
            }
            var ancestor = child;
            while (!(ancestor == this || ancestor == null)) {
                ancestor = ancestor.parent;
            }
            return ancestor == this;
        };
        /**
         * 添加指定的 Bone 实例做为当前 Bone 实例的子骨头
         * @param childBone {Bone} 需要添加的 Bone 实例
         * @param updateLater {boolean} 是否延迟更新。默认false。当需要一次性添加很多 Bone 时，开启延迟更新能够提高效率
         */
        Bone.prototype.addChildBone = function (childBone, updateLater) {
            if (updateLater === void 0) { updateLater = false; }
            if (!childBone) {
                throw new Error();
            }
            if (childBone == this || childBone.contains(this)) {
                throw new Error();
            }
            if (childBone.parent == this) {
                return;
            }
            if (childBone.parent) {
                childBone.parent.removeChildBone(childBone, updateLater);
            }
            this._boneList[this._boneList.length] = childBone;
            childBone._setParent(this);
            childBone._setArmature(this._armature);
            if (this._armature && !updateLater) {
                this._armature._updateAnimationAfterBoneListChanged();
            }
        };
        /**
         * 从当前 Bone 实例中移除指定的子骨头
         * @param childBone {Bone} 需要移除的 Bone 实例
         * @param updateLater {boolean} 是否延迟更新。默认false。当需要一次性移除很多 Bone 时，开启延迟更新能够提高效率
         */
        Bone.prototype.removeChildBone = function (childBone, updateLater) {
            if (updateLater === void 0) { updateLater = false; }
            if (!childBone) {
                throw new Error();
            }
            var index = this._boneList.indexOf(childBone);
            if (index < 0) {
                throw new Error();
            }
            this._boneList.splice(index, 1);
            childBone._setParent(null);
            childBone._setArmature(null);
            if (this._armature && !updateLater) {
                this._armature._updateAnimationAfterBoneListChanged(false);
            }
        };
        /**
         * 向当前 Bone 实例中添加指定的 Slot 实例
         * @param childSlot {Slot} 需要添加的 Slot 实例
         */
        Bone.prototype.addSlot = function (childSlot) {
            if (!childSlot) {
                throw new Error();
            }
            if (childSlot.parent) {
                childSlot.parent.removeSlot(childSlot);
            }
            this._slotList[this._slotList.length] = childSlot;
            childSlot._setParent(this);
            childSlot.setArmature(this._armature);
        };
        /**
         * 从当前 Bone 实例中移除指定的 Slot 实例
         * @param childSlot {Slot} 需要移除的 Slot 实例
         */
        Bone.prototype.removeSlot = function (childSlot) {
            if (!childSlot) {
                throw new Error();
            }
            var index = this._slotList.indexOf(childSlot);
            if (index < 0) {
                throw new Error();
            }
            this._slotList.splice(index, 1);
            childSlot._setParent(null);
            childSlot.setArmature(null);
        };
        /** @private */
        Bone.prototype._setArmature = function (value) {
            if (this._armature == value) {
                return;
            }
            if (this._armature) {
                this._armature._removeBoneFromBoneList(this);
                this._armature._updateAnimationAfterBoneListChanged(false);
            }
            this._armature = value;
            if (this._armature) {
                this._armature._addBoneToBoneList(this);
            }
            var i = this._boneList.length;
            while (i--) {
                this._boneList[i]._setArmature(this._armature);
            }
            i = this._slotList.length;
            while (i--) {
                this._slotList[i].setArmature(this._armature);
            }
        };
        /**
         * 获取当前骨头包含的所有 Bone 实例
         * @param returnCopy {boolean} 是否返回拷贝。默认：true
         * @returns {Bone[]}
         */
        Bone.prototype.getBones = function (returnCopy) {
            if (returnCopy === void 0) { returnCopy = true; }
            return returnCopy ? this._boneList.concat() : this._boneList;
        };
        /**
         * 获取当前骨头包含的所有 Slot 实例
         * @param returnCopy {boolean} 是否返回拷贝。默认：true
         * @returns {Slot[]}
         */
        Bone.prototype.getSlots = function (returnCopy) {
            if (returnCopy === void 0) { returnCopy = true; }
            return returnCopy ? this._slotList.concat() : this._slotList;
        };
        //动画
        /**
         * 在下一帧强制更新当前 Bone 实例及其包含的所有 Slot 的动画。
         */
        Bone.prototype.invalidUpdate = function () {
            this._needUpdate = 2;
        };
        Bone.prototype._calculateRelativeParentTransform = function () {
            this._global.scaleX = this._origin.scaleX * this._tween.scaleX * this._offset.scaleX;
            this._global.scaleY = this._origin.scaleY * this._tween.scaleY * this._offset.scaleY;
            this._global.skewX = this._origin.skewX + this._tween.skewX + this._offset.skewX;
            this._global.skewY = this._origin.skewY + this._tween.skewY + this._offset.skewY;
            this._global.x = this._origin.x + this._tween.x + this._offset.x;
            this._global.y = this._origin.y + this._tween.y + this._offset.y;
        };
        /** @private */
        Bone.prototype._update = function (needUpdate) {
            if (needUpdate === void 0) { needUpdate = false; }
            this._needUpdate--;
            if (needUpdate || this._needUpdate > 0 || (this._parent && this._parent._needUpdate > 0)) {
                this._needUpdate = 1;
            }
            else {
                return;
            }
            this.blendingTimeline();
            //计算global
            var result = this._updateGlobal();
            var parentGlobalTransform = result ? result.parentGlobalTransform : null;
            var parentGlobalTransformMatrix = result ? result.parentGlobalTransformMatrix : null;
            //计算globalForChild
            var ifExistOffsetTranslation = this._offset.x != 0 || this._offset.y != 0;
            var ifExistOffsetScale = this._offset.scaleX != 0 || this._offset.scaleY != 0;
            var ifExistOffsetRotation = this._offset.skewX != 0 || this._offset.skewY != 0;
            if ((!ifExistOffsetTranslation || this.applyOffsetTranslationToChild) &&
                (!ifExistOffsetScale || this.applyOffsetScaleToChild) &&
                (!ifExistOffsetRotation || this.applyOffsetRotationToChild)) {
                this._globalTransformForChild = this._global;
                this._globalTransformMatrixForChild = this._globalTransformMatrix;
            }
            else {
                if (!this._tempGlobalTransformForChild) {
                    this._tempGlobalTransformForChild = new dragonBones.DBTransform();
                }
                this._globalTransformForChild = this._tempGlobalTransformForChild;
                if (!this._tempGlobalTransformMatrixForChild) {
                    this._tempGlobalTransformMatrixForChild = new dragonBones.Matrix();
                }
                this._globalTransformMatrixForChild = this._tempGlobalTransformMatrixForChild;
                this._globalTransformForChild.x = this._origin.x + this._tween.x;
                this._globalTransformForChild.y = this._origin.y + this._tween.y;
                this._globalTransformForChild.scaleX = this._origin.scaleX * this._tween.scaleX;
                this._globalTransformForChild.scaleY = this._origin.scaleY * this._tween.scaleY;
                this._globalTransformForChild.skewX = this._origin.skewX + this._tween.skewX;
                this._globalTransformForChild.skewY = this._origin.skewY + this._tween.skewY;
                if (this.applyOffsetTranslationToChild) {
                    this._globalTransformForChild.x += this._offset.x;
                    this._globalTransformForChild.y += this._offset.y;
                }
                if (this.applyOffsetScaleToChild) {
                    this._globalTransformForChild.scaleX *= this._offset.scaleX;
                    this._globalTransformForChild.scaleY *= this._offset.scaleY;
                }
                if (this.applyOffsetRotationToChild) {
                    this._globalTransformForChild.skewX += this._offset.skewX;
                    this._globalTransformForChild.skewY += this._offset.skewY;
                }
                dragonBones.TransformUtil.transformToMatrix(this._globalTransformForChild, this._globalTransformMatrixForChild, true);
                if (parentGlobalTransformMatrix) {
                    this._globalTransformMatrixForChild.concat(parentGlobalTransformMatrix);
                    dragonBones.TransformUtil.matrixToTransform(this._globalTransformMatrixForChild, this._globalTransformForChild, this._globalTransformForChild.scaleX * parentGlobalTransform.scaleX >= 0, this._globalTransformForChild.scaleY * parentGlobalTransform.scaleY >= 0);
                }
            }
        };
        /** @private */
        Bone.prototype._updateColor = function (aOffset, rOffset, gOffset, bOffset, aMultiplier, rMultiplier, gMultiplier, bMultiplier, colorChanged) {
            var length = this._slotList.length;
            for (var i = 0; i < length; i++) {
                var childSlot = this._slotList[i];
                childSlot._updateDisplayColor(aOffset, rOffset, gOffset, bOffset, aMultiplier, rMultiplier, gMultiplier, bMultiplier);
            }
            this._isColorChanged = colorChanged;
        };
        /** @private */
        Bone.prototype._hideSlots = function () {
            var length = this._slotList.length;
            for (var i = 0; i < length; i++) {
                var childSlot = this._slotList[i];
                childSlot._changeDisplay(-1);
            }
        };
        /** @private When bone timeline enter a key frame, call this func*/
        Bone.prototype._arriveAtFrame = function (frame, timelineState, animationState, isCross) {
            var displayControl = animationState.displayControl &&
                (!this.displayController || this.displayController == animationState.name) &&
                animationState.containsBoneMask(this.name);
            if (displayControl) {
                var tansformFrame = frame;
                var displayIndex = tansformFrame.displayIndex;
                var childSlot;
                if (frame.event && this._armature.hasEventListener(dragonBones.FrameEvent.BONE_FRAME_EVENT)) {
                    var frameEvent = new dragonBones.FrameEvent(dragonBones.FrameEvent.BONE_FRAME_EVENT);
                    frameEvent.bone = this;
                    frameEvent.animationState = animationState;
                    frameEvent.frameLabel = frame.event;
                    this._armature._eventList.push(frameEvent);
                }
                if (frame.sound && Bone._soundManager.hasEventListener(dragonBones.SoundEvent.SOUND)) {
                    var soundEvent = new dragonBones.SoundEvent(dragonBones.SoundEvent.SOUND);
                    soundEvent.armature = this._armature;
                    soundEvent.animationState = animationState;
                    soundEvent.sound = frame.sound;
                    Bone._soundManager.dispatchEvent(soundEvent);
                }
                //[TODO]currently there is only gotoAndPlay belongs to frame action. In future, there will be more.  
                //后续会扩展更多的action，目前只有gotoAndPlay的含义
                if (frame.action) {
                    var length1 = this._slotList.length;
                    for (var i1 = 0; i1 < length1; i1++) {
                        childSlot = this._slotList[i1];
                        var childArmature = childSlot.childArmature;
                        if (childArmature) {
                            childArmature.animation.gotoAndPlay(frame.action);
                        }
                    }
                }
            }
        };
        /** @private */
        Bone.prototype._addState = function (timelineState) {
            if (this._timelineStateList.indexOf(timelineState) < 0) {
                this._timelineStateList.push(timelineState);
                this._timelineStateList.sort(this.sortState);
            }
        };
        /** @private */
        Bone.prototype._removeState = function (timelineState) {
            var index = this._timelineStateList.indexOf(timelineState);
            if (index >= 0) {
                this._timelineStateList.splice(index, 1);
            }
        };
        /** @private */
        Bone.prototype._removeAllStates = function () {
            this._timelineStateList.length = 0;
        };
        Bone.prototype.blendingTimeline = function () {
            var timelineState;
            var transform;
            var pivot;
            var weight;
            var i = this._timelineStateList.length;
            if (i == 1) {
                timelineState = this._timelineStateList[0];
                weight = timelineState._animationState.weight * timelineState._animationState.fadeWeight;
                timelineState._weight = weight;
                transform = timelineState._transform;
                pivot = timelineState._pivot;
                this._tween.x = transform.x * weight;
                this._tween.y = transform.y * weight;
                this._tween.skewX = transform.skewX * weight;
                this._tween.skewY = transform.skewY * weight;
                this._tween.scaleX = 1 + (transform.scaleX - 1) * weight;
                this._tween.scaleY = 1 + (transform.scaleY - 1) * weight;
                this._tweenPivot.x = pivot.x * weight;
                this._tweenPivot.y = pivot.y * weight;
            }
            else if (i > 1) {
                var x = 0;
                var y = 0;
                var skewX = 0;
                var skewY = 0;
                var scaleX = 1;
                var scaleY = 1;
                var pivotX = 0;
                var pivotY = 0;
                var weigthLeft = 1;
                var layerTotalWeight = 0;
                var prevLayer = this._timelineStateList[i - 1]._animationState.layer;
                var currentLayer = 0;
                //Traversal the layer from up to down
                //layer由高到低依次遍历
                while (i--) {
                    timelineState = this._timelineStateList[i];
                    currentLayer = timelineState._animationState.layer;
                    if (prevLayer != currentLayer) {
                        if (layerTotalWeight >= weigthLeft) {
                            timelineState._weight = 0;
                            break;
                        }
                        else {
                            weigthLeft -= layerTotalWeight;
                        }
                    }
                    prevLayer = currentLayer;
                    weight = timelineState._animationState.weight * timelineState._animationState.fadeWeight * weigthLeft;
                    timelineState._weight = weight;
                    if (weight && timelineState._blendEnabled) {
                        transform = timelineState._transform;
                        pivot = timelineState._pivot;
                        x += transform.x * weight;
                        y += transform.y * weight;
                        skewX += transform.skewX * weight;
                        skewY += transform.skewY * weight;
                        scaleX += (transform.scaleX - 1) * weight;
                        scaleY += (transform.scaleY - 1) * weight;
                        pivotX += pivot.x * weight;
                        pivotY += pivot.y * weight;
                        layerTotalWeight += weight;
                    }
                }
                this._tween.x = x;
                this._tween.y = y;
                this._tween.skewX = skewX;
                this._tween.skewY = skewY;
                this._tween.scaleX = scaleX;
                this._tween.scaleY = scaleY;
                this._tweenPivot.x = pivotX;
                this._tweenPivot.y = pivotY;
            }
        };
        Bone.prototype.sortState = function (state1, state2) {
            return state1._animationState.layer < state2._animationState.layer ? -1 : 1;
        };
        Object.defineProperty(Bone.prototype, "childArmature", {
            /**
             * 不推荐的API,建议使用 slot.childArmature 替代
             */
            get: function () {
                if (this.slot) {
                    return this.slot.childArmature;
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bone.prototype, "display", {
            /**
             * 不推荐的API,建议使用 slot.display 替代
             */
            get: function () {
                if (this.slot) {
                    return this.slot.display;
                }
                return null;
            },
            set: function (value) {
                if (this.slot) {
                    this.slot.display = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bone.prototype, "node", {
            /**
             * 不推荐的API,建议使用 offset 替代
             */
            get: function () {
                return this._offset;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bone.prototype, "visible", {
            /** @private */
            set: function (value) {
                if (this._visible != value) {
                    this._visible = value;
                    var length = this._slotList.length;
                    for (var i = 0; i < length; i++) {
                        var childSlot = this._slotList[i];
                        childSlot._updateDisplayVisible(this._visible);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bone.prototype, "slot", {
            /**
             * 返回当前 Bone 实例包含的第一个 Slot 实例
             * @member {Slot} dragonBones.Bone#slot
             */
            get: function () {
                return this._slotList.length > 0 ? this._slotList[0] : null;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * The instance dispatch sound event.
         */
        Bone._soundManager = dragonBones.SoundEventManager.getInstance();
        return Bone;
    })(dragonBones.DBObject);
    dragonBones.Bone = Bone;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.Armature
     * @classdesc
     * Armature 是 DragonBones 骨骼动画系统的核心。他包含需要加到场景的显示对象，所有的骨骼逻辑和动画系统
     * A Armature instance is the core of the skeleton animation system. It contains the object to display, all sub-bones and the object animation(s).
     * @extends dragonBones.EventDispatcher
     * @see dragonBones.ArmatureData
     * @example
     * <pre>
        //获取动画数据
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");

        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[0].name;
        //从工厂里创建出Armature
        var armature:dragonBones.Armature = factory.buildArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        //把它添加到舞台上
        this.addChild(armatureDisplay);
        //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName = armature.animation.animationList[0];
        //播放这个动画，gotoAndPlay参数说明,具体详见Animation类
        //第一个参数 animationName {string} 指定播放动画的名称.
        //第二个参数 fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
        //第三个参数 duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
        //第四个参数 layTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
        armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);

        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
       </pre>
     */
    var Armature = (function (_super) {
        __extends(Armature, _super);
        function Armature(display) {
            _super.call(this);
            this._display = display;
            this._animation = new dragonBones.Animation(this);
            this._slotsZOrderChanged = false;
            this._slotList = [];
            this._boneList = [];
            this._eventList = [];
            this._delayDispose = false;
            this._lockDispose = false;
            this._armatureData = null;
        }
        Object.defineProperty(Armature.prototype, "armatureData", {
            /**
             * 骨架数据。
             * @member {ArmatureData} dragonBones.Armature#armatureData
             */
            get: function () {
                return this._armatureData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Armature.prototype, "display", {
            /**
             * 骨架显示对象。骨架创建出来后，需要把该显示对象加到场景中才能显示骨架。
             * 使用根据不同的渲染引擎，显示对象的类型可能不同。
             * @member {any} dragonBones.Armature#display
             */
            get: function () {
                return this._display;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 不推荐的API,使用 display 属性代替。
         */
        Armature.prototype.getDisplay = function () {
            return this._display;
        };
        Object.defineProperty(Armature.prototype, "animation", {
            /**
             * 骨架的动画实例。
             * @member {Animation} dragonBones.Armature#animation
             */
            get: function () {
                return this._animation;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 清理骨架实例
         */
        Armature.prototype.dispose = function () {
            this._delayDispose = true;
            if (!this._animation || this._lockDispose) {
                return;
            }
            this.userData = null;
            this._animation.dispose();
            var i = this._slotList.length;
            while (i--) {
                this._slotList[i].dispose();
            }
            i = this._boneList.length;
            while (i--) {
                this._boneList[i].dispose();
            }
            this._armatureData = null;
            this._animation = null;
            this._slotList = null;
            this._boneList = null;
            this._eventList = null;
            //_display = null;
        };
        /**
         * 在下一帧强制更新指定名称的 Bone 及其包含的所有 Slot 的动画。
         * @param boneName {string} 骨头名。 默认值：null，相当于更新所有骨头。
         */
        Armature.prototype.invalidUpdate = function (boneName) {
            if (boneName === void 0) { boneName = null; }
            if (boneName) {
                var bone = this.getBone(boneName);
                if (bone) {
                    bone.invalidUpdate();
                }
            }
            else {
                var i = this._boneList.length;
                while (i--) {
                    this._boneList[i].invalidUpdate();
                }
            }
        };
        /**
         * 使用这个方法更新动画状态。一般来说，这个方法需要在 ENTERFRAME 事件的响应函数中被调用
         * @param passedTime 动画向前播放的时间（单位：秒）
         */
        Armature.prototype.advanceTime = function (passedTime) {
            this._lockDispose = true;
            this._animation._advanceTime(passedTime);
            passedTime *= this._animation.timeScale; //_animation's time scale will impact childArmature
            var isFading = this._animation._isFading;
            var i = this._boneList.length;
            while (i--) {
                var bone = this._boneList[i];
                bone._update(isFading);
            }
            i = this._slotList.length;
            while (i--) {
                var slot = this._slotList[i];
                slot._update();
                if (slot._isShowDisplay) {
                    var childArmature = slot.childArmature;
                    if (childArmature) {
                        childArmature.advanceTime(passedTime);
                    }
                }
            }
            if (this._slotsZOrderChanged) {
                this.updateSlotsZOrder();
                if (this.hasEventListener(dragonBones.ArmatureEvent.Z_ORDER_UPDATED)) {
                    this.dispatchEvent(new dragonBones.ArmatureEvent(dragonBones.ArmatureEvent.Z_ORDER_UPDATED));
                }
            }
            if (this._eventList.length > 0) {
                for (var i = 0, len = this._eventList.length; i < len; i++) {
                    var event = this._eventList[i];
                    this.dispatchEvent(event);
                }
                this._eventList.length = 0;
            }
            this._lockDispose = false;
            if (this._delayDispose) {
                this.dispose();
            }
        };
        Armature.prototype.resetAnimation = function () {
            this.animation.stop();
            this.animation._resetAnimationStateList();
            for (var i = 0, len = this._boneList.length; i < len; i++) {
                this._boneList[i]._removeAllStates();
            }
        };
        /**
         * 获取骨架包含的所有插槽
         * @param returnCopy {boolean} 是否返回拷贝。默认：true
         * @returns {Slot[]}
         */
        Armature.prototype.getSlots = function (returnCopy) {
            if (returnCopy === void 0) { returnCopy = true; }
            return returnCopy ? this._slotList.concat() : this._slotList;
        };
        /**
         * 获取指定名称的 Slot
         * @param slotName {string} Slot名称
         * @returns {Slot}
         */
        Armature.prototype.getSlot = function (slotName) {
            var length = this._slotList.length;
            for (var i = 0; i < length; i++) {
                var slot = this._slotList[i];
                if (slot.name == slotName) {
                    return slot;
                }
            }
            return null;
        };
        /**
         * 获取包含指定显示对象的 Slot
         * @param displayObj {any} 显示对象实例
         * @returns {Slot}
         */
        Armature.prototype.getSlotByDisplay = function (displayObj) {
            if (displayObj) {
                var length = this._slotList.length;
                for (var i = 0; i < length; i++) {
                    var slot = this._slotList[i];
                    if (slot.display == displayObj) {
                        return slot;
                    }
                }
            }
            return null;
        };
        /**
         * 为指定名称的 Bone 添加一个子 Slot
         * @param slot {Slot} Slot 实例
         * @param boneName {string}
         * @see dragonBones.Bone
         */
        Armature.prototype.addSlot = function (slot, boneName) {
            var bone = this.getBone(boneName);
            if (bone) {
                bone.addSlot(slot);
            }
            else {
                throw new Error();
            }
        };
        /**
         * 移除指定的Slot
         * @param slot {Slot} Slot 实例
         */
        Armature.prototype.removeSlot = function (slot) {
            if (!slot || slot.armature != this) {
                throw new Error();
            }
            slot.parent.removeSlot(slot);
        };
        /**
         * 移除指定名称的Slot
         * @param slotName {string} Slot 名称
         * @returns {Slot} 被成功移除的 Slot 实例
         */
        Armature.prototype.removeSlotByName = function (slotName) {
            var slot = this.getSlot(slotName);
            if (slot) {
                this.removeSlot(slot);
            }
            return slot;
        };
        /**
         * 获取骨架包含的所有Bone
         * @param returnCopy {boolean} 是否返回拷贝。默认：true
         * @returns {Bone[]}
         */
        Armature.prototype.getBones = function (returnCopy) {
            if (returnCopy === void 0) { returnCopy = true; }
            return returnCopy ? this._boneList.concat() : this._boneList;
        };
        /**
         * 获取指定名称的 Bone
         * @param boneName {string} Bone名称
         * @returns {Bone}
         */
        Armature.prototype.getBone = function (boneName) {
            var length = this._boneList.length;
            for (var i = 0; i < length; i++) {
                var bone = this._boneList[i];
                if (bone.name == boneName) {
                    return bone;
                }
            }
            return null;
        };
        /**
         * 获取包含指定显示对象的 Bone
         * @param display {any} 显示对象实例
         * @returns {Bone}
         */
        Armature.prototype.getBoneByDisplay = function (display) {
            var slot = this.getSlotByDisplay(display);
            return slot ? slot.parent : null;
        };
        /**
         * 在骨架中为指定名称的 Bone 添加一个子 Bone
         * @param bone {Bone} Bone 实例
         * @param parentName {string} 父骨头名称 默认：null
         * @param updateLater {boolean} 是否延迟更新 默认：false，当需要一次添加很多Bone时，开启延迟更新能够提高效率
         */
        Armature.prototype.addBone = function (bone, parentName, updateLater) {
            if (parentName === void 0) { parentName = null; }
            if (updateLater === void 0) { updateLater = false; }
            var parentBone;
            if (parentName) {
                parentBone = this.getBone(parentName);
                if (!parentBone) {
                    throw new Error();
                }
            }
            if (parentBone) {
                parentBone.addChildBone(bone, updateLater);
            }
            else {
                if (bone.parent) {
                    bone.parent.removeChildBone(bone, updateLater);
                }
                bone._setArmature(this);
                if (!updateLater) {
                    this._updateAnimationAfterBoneListChanged();
                }
            }
        };
        /**
         * 移除指定的 Bone
         * @param bone {Bone} Bone 实例
         * @param updateLater {boolean} 是否延迟更新 默认：false，当需要一次移除很多Bone时，开启延迟更新能够提高效率
         */
        Armature.prototype.removeBone = function (bone, updateLater) {
            if (updateLater === void 0) { updateLater = false; }
            if (!bone || bone.armature != this) {
                throw new Error();
            }
            if (bone.parent) {
                bone.parent.removeChildBone(bone, updateLater);
            }
            else {
                bone._setArmature(null);
                if (!updateLater) {
                    this._updateAnimationAfterBoneListChanged(false);
                }
            }
        };
        /**
         * 移除指定名称的 Bone
         * @param boneName {string} Bone 名称
         * @returns {Bone} 被成功移除的 Bone 实例
         */
        Armature.prototype.removeBoneByName = function (boneName) {
            var bone = this.getBone(boneName);
            if (bone) {
                this.removeBone(bone);
            }
            return bone;
        };
        /** @private */
        Armature.prototype._addBoneToBoneList = function (bone) {
            if (this._boneList.indexOf(bone) < 0) {
                this._boneList[this._boneList.length] = bone;
            }
        };
        /** @private */
        Armature.prototype._removeBoneFromBoneList = function (bone) {
            var index = this._boneList.indexOf(bone);
            if (index >= 0) {
                this._boneList.splice(index, 1);
            }
        };
        /** @private */
        Armature.prototype._addSlotToSlotList = function (slot) {
            if (this._slotList.indexOf(slot) < 0) {
                this._slotList[this._slotList.length] = slot;
            }
        };
        /** @private */
        Armature.prototype._removeSlotFromSlotList = function (slot) {
            var index = this._slotList.indexOf(slot);
            if (index >= 0) {
                this._slotList.splice(index, 1);
            }
        };
        /**
         * 按照显示层级为所有 Slot 排序
         */
        Armature.prototype.updateSlotsZOrder = function () {
            this._slotList.sort(this.sortSlot);
            var i = this._slotList.length;
            while (i--) {
                var slot = this._slotList[i];
                if (slot._isShowDisplay) {
                    //_display 实际上是container, 这个方法就是把原来的显示对象放到container中的第一个
                    slot._addDisplayToContainer(this._display);
                }
            }
            this._slotsZOrderChanged = false;
        };
        Armature.prototype._updateAnimationAfterBoneListChanged = function (ifNeedSortBoneList) {
            if (ifNeedSortBoneList === void 0) { ifNeedSortBoneList = true; }
            if (ifNeedSortBoneList) {
                this.sortBoneList();
            }
            this._animation._updateAnimationStates();
        };
        Armature.prototype.sortBoneList = function () {
            var i = this._boneList.length;
            if (i == 0) {
                return;
            }
            var helpArray = [];
            while (i--) {
                var level = 0;
                var bone = this._boneList[i];
                var boneParent = bone;
                while (boneParent) {
                    level++;
                    boneParent = boneParent.parent;
                }
                helpArray[i] = [level, bone];
            }
            helpArray.sort(dragonBones.ArmatureData.sortBoneDataHelpArrayDescending);
            i = helpArray.length;
            while (i--) {
                this._boneList[i] = helpArray[i][1];
            }
            helpArray.length = 0;
        };
        /** @private When AnimationState enter a key frame, call this func*/
        Armature.prototype._arriveAtFrame = function (frame, timelineState, animationState, isCross) {
            if (frame.event && this.hasEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT)) {
                var frameEvent = new dragonBones.FrameEvent(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT);
                frameEvent.animationState = animationState;
                frameEvent.frameLabel = frame.event;
                this._eventList.push(frameEvent);
            }
            if (frame.sound && Armature._soundManager.hasEventListener(dragonBones.SoundEvent.SOUND)) {
                var soundEvent = new dragonBones.SoundEvent(dragonBones.SoundEvent.SOUND);
                soundEvent.armature = this;
                soundEvent.animationState = animationState;
                soundEvent.sound = frame.sound;
                Armature._soundManager.dispatchEvent(soundEvent);
            }
            //[TODO]currently there is only gotoAndPlay belongs to frame action. In future, there will be more.  
            //后续会扩展更多的action，目前只有gotoAndPlay的含义
            if (frame.action) {
                if (animationState.displayControl) {
                    this.animation.gotoAndPlay(frame.action);
                }
            }
        };
        Armature.prototype.sortSlot = function (slot1, slot2) {
            return slot1.zOrder < slot2.zOrder ? 1 : -1;
        };
        /**
         * 获取Animation实例
         * @returns {any} Animation实例
         */
        Armature.prototype.getAnimation = function () {
            return this._animation;
        };
        /**
         * The instance dispatch sound event.
         */
        Armature._soundManager = dragonBones.SoundEventManager.getInstance();
        return Armature;
    })(dragonBones.EventDispatcher);
    dragonBones.Armature = Armature;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.WorldClock
     * @classdesc
     * WorldClock 提供时钟的支持，为控制每个加入时钟的 IAnimatable 对象正确的播放动画。
     * 一般来说，每当 Armature 被创建出来后，只需要将之加入 WorldClock,之后只需要控制 WorldClock 的前进，就可以实现所有 Armature 的动画前进了
     * @see dragonBones.IAnimatable
     * @see dragonBones.Armature
     */
    var WorldClock = (function () {
        /**
         * 创建一个新的 WorldClock 实例。
         * 一般来说，不需要单独创建 WorldClock 的实例，可以直接使用 WorldClock.clock 静态实例就可以了。
         * @param time {number} 开始时间
         * @param timeScale {number} 时间缩放系数
         */
        function WorldClock(time, timeScale) {
            if (time === void 0) { time = -1; }
            if (timeScale === void 0) { timeScale = 1; }
            this._time = time >= 0 ? time : new Date().getTime() * 0.001;
            this._timeScale = isNaN(timeScale) ? 1 : timeScale;
            this._animatableList = [];
        }
        Object.defineProperty(WorldClock.prototype, "time", {
            get: function () {
                return this._time;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WorldClock.prototype, "timeScale", {
            /**
             * 时间缩放系数。用于实现动画的变速播放
             * @member {number} dragonBones.WorldClock#timeScale
             */
            get: function () {
                return this._timeScale;
            },
            set: function (value) {
                if (isNaN(value) || value < 0) {
                    value = 1;
                }
                this._timeScale = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 检查是否包含指定的 IAnimatable 实例
         * @param animatable {IAnimatable} IAnimatable 实例
         * @returns {boolean}
         */
        WorldClock.prototype.contains = function (animatable) {
            return this._animatableList.indexOf(animatable) >= 0;
        };
        /**
         * 将一个 IAnimatable 实例加入到时钟
         * @param animatable {IAnimatable} IAnimatable 实例
         */
        WorldClock.prototype.add = function (animatable) {
            if (animatable && this._animatableList.indexOf(animatable) == -1) {
                this._animatableList.push(animatable);
                console.debug('add clock');
            }
        };
        /**
         * 将一个 IAnimatable 实例从时钟中移除
         * @param animatable {IAnimatable} IAnimatable 实例
         */
        WorldClock.prototype.remove = function (animatable) {
            var index = this._animatableList.indexOf(animatable);
            if (index >= 0) {
            	console.debug('remove');
                this._animatableList[index] = null;
            }
        };
        /**
         * 从时钟中移除所有的 IAnimatable 实例.
         */
        WorldClock.prototype.clear = function () {
            this._animatableList.length = 0;
        };
        /**
         * 更新所有包含的 IAnimatable 实例，将他们的动画向前播放指定的时间。一般来说，这个方法需要在 ENTERFRAME 事件的响应函数中被调用
         * @param passedTime {number} 前进的时间，默认值为-1，DragonBones会自动为你计算当前帧与上一帧的时间差
         */
        WorldClock.prototype.advanceTime = function (passedTime) {
            if (passedTime === void 0) { passedTime = -1; }
            if (passedTime < 0) {
                passedTime = new Date().getTime() * 0.001 - this._time;
            }
            passedTime *= this._timeScale;
            this._time += passedTime;
            var length = this._animatableList.length;
            if (length == 0) {
                return;
            }
            var currentIndex = 0;
            for (var i = 0; i < length; i++) {
                var animatable = this._animatableList[i];
                if (animatable) {
                    if (currentIndex != i) {
                        this._animatableList[currentIndex] = animatable;
                        this._animatableList[i] = null;
                    }
                    animatable.advanceTime(passedTime);
                    currentIndex++;
                }
            }
            if (currentIndex != i) {
                length = this._animatableList.length;
                while (i < length) {
                    this._animatableList[currentIndex++] = this._animatableList[i++];
                }
                this._animatableList.length = currentIndex;
            }
        };
        /**
         * 可以直接使用的全局静态时钟实例.
         * @type dragonBones.WorldClock
         */
        WorldClock.clock = new WorldClock();
        return WorldClock;
    })();
    dragonBones.WorldClock = WorldClock;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.TimelineState
     * @classdesc
     * TimelineState 负责计算 Bone 的时间轴动画。
     * TimelineState 实例隶属于 AnimationState. AnimationState在创建时会为每个包含动作的 Bone生成一个 TimelineState 实例.
     * @see dragonBones.Animation
     * @see dragonBones.AnimationState
     * @see dragonBones.Bone
     */
    var TimelineState = (function () {
        function TimelineState() {
            this._totalTime = 0; //duration
            this._currentTime = 0;
            this._lastTime = 0;
            this._currentFrameIndex = 0;
            this._currentFramePosition = 0;
            this._currentFrameDuration = 0;
            //-1: frameLength>1, 0:frameLength==0, 1:frameLength==1
            this._updateMode = 0;
            this._transform = new dragonBones.DBTransform();
            this._pivot = new dragonBones.Point();
            this._durationTransform = new dragonBones.DBTransform();
            this._durationPivot = new dragonBones.Point();
            this._durationColor = new dragonBones.ColorTransform();
        }
        /** @private */
        TimelineState._borrowObject = function () {
            if (TimelineState._pool.length == 0) {
                return new TimelineState();
            }
            return TimelineState._pool.pop();
        };
        /** @private */
        TimelineState._returnObject = function (timeline) {
            if (TimelineState._pool.indexOf(timeline) < 0) {
                TimelineState._pool[TimelineState._pool.length] = timeline;
            }
            timeline.clear();
        };
        /** @private */
        TimelineState._clear = function () {
            var i = TimelineState._pool.length;
            while (i--) {
                TimelineState._pool[i].clear();
            }
            TimelineState._pool.length = 0;
        };
        TimelineState.prototype.clear = function () {
            if (this._bone) {
                this._bone._removeState(this);
                this._bone = null;
            }
            this._armature = null;
            this._animation = null;
            this._animationState = null;
            this._timelineData = null;
            this._originTransform = null;
            this._originPivot = null;
        };
        //动画开始结束
        /** @private */
        TimelineState.prototype._fadeIn = function (bone, animationState, timelineData) {
            this._bone = bone;
            this._armature = this._bone.armature;
            this._animation = this._armature.animation;
            this._animationState = animationState;
            this._timelineData = timelineData;
            this._originTransform = this._timelineData.originTransform;
            this._originPivot = this._timelineData.originPivot;
            this.name = timelineData.name;
            this._totalTime = this._timelineData.duration;
            this._rawAnimationScale = this._animationState.clip.scale;
            this._isComplete = false;
            this._blendEnabled = false;
            this._tweenTransform = false;
            this._tweenScale = false;
            this._currentFrameIndex = -1;
            this._currentTime = -1;
            this._tweenEasing = NaN;
            this._weight = 1;
            this._transform.x = 0;
            this._transform.y = 0;
            this._transform.scaleX = 1;
            this._transform.scaleY = 1;
            this._transform.skewX = 0;
            this._transform.skewY = 0;
            this._pivot.x = 0;
            this._pivot.y = 0;
            this._durationTransform.x = 0;
            this._durationTransform.y = 0;
            this._durationTransform.scaleX = 1;
            this._durationTransform.scaleY = 1;
            this._durationTransform.skewX = 0;
            this._durationTransform.skewY = 0;
            this._durationPivot.x = 0;
            this._durationPivot.y = 0;
            switch (this._timelineData.frameList.length) {
                case 0:
                    this._updateMode = 0;
                    break;
                case 1:
                    this._updateMode = 1;
                    break;
                default:
                    this._updateMode = -1;
                    break;
            }
            this._bone._addState(this);
        };
        /** @private */
        TimelineState.prototype._fadeOut = function () {
            this._transform.skewX = dragonBones.TransformUtil.formatRadian(this._transform.skewX);
            this._transform.skewY = dragonBones.TransformUtil.formatRadian(this._transform.skewY);
        };
        //动画进行中
        /** @private */
        TimelineState.prototype._update = function (progress) {
            if (this._updateMode == -1) {
                this.updateMultipleFrame(progress);
            }
            else if (this._updateMode == 1) {
                this._updateMode = 0;
                this.updateSingleFrame();
            }
        };
        TimelineState.prototype.updateMultipleFrame = function (progress) {
            var currentPlayTimes = 0;
            progress /= this._timelineData.scale;
            progress += this._timelineData.offset;
            var currentTime = this._totalTime * progress;
            var playTimes = this._animationState.playTimes;
            if (playTimes == 0) {
                this._isComplete = false;
                currentPlayTimes = Math.ceil(Math.abs(currentTime) / this._totalTime) || 1;
                if (currentTime >= 0) {
                    currentTime -= Math.floor(currentTime / this._totalTime) * this._totalTime;
                }
                else {
                    currentTime -= Math.ceil(currentTime / this._totalTime) * this._totalTime;
                }
                if (currentTime < 0) {
                    currentTime += this._totalTime;
                }
            }
            else {
                var totalTimes = playTimes * this._totalTime;
                if (currentTime >= totalTimes) {
                    currentTime = totalTimes;
                    this._isComplete = true;
                }
                else if (currentTime <= -totalTimes) {
                    currentTime = -totalTimes;
                    this._isComplete = true;
                }
                else {
                    this._isComplete = false;
                }
                if (currentTime < 0) {
                    currentTime += totalTimes;
                }
                currentPlayTimes = Math.ceil(currentTime / this._totalTime) || 1;
                if (this._isComplete) {
                    currentTime = this._totalTime;
                }
                else {
                    if (currentTime >= 0) {
                        currentTime -= Math.floor(currentTime / this._totalTime) * this._totalTime;
                    }
                    else {
                        currentTime -= Math.ceil(currentTime / this._totalTime) * this._totalTime;
                    }
                }
            }
            if (this._currentTime != currentTime) {
                this._lastTime = this._currentTime;
                this._currentTime = currentTime;
                var frameList = this._timelineData.frameList;
                var prevFrame;
                var currentFrame;
                for (var i = 0, l = this._timelineData.frameList.length; i < l; ++i) {
                    if (this._currentFrameIndex < 0) {
                        this._currentFrameIndex = 0;
                    }
                    else if (this._currentTime < this._currentFramePosition || this._currentTime >= this._currentFramePosition + this._currentFrameDuration || this._currentTime < this._lastTime) {
                        this._currentFrameIndex++;
                        this._lastTime = this._currentTime;
                        if (this._currentFrameIndex >= frameList.length) {
                            if (this._isComplete) {
                                this._currentFrameIndex--;
                                break;
                            }
                            else {
                                this._currentFrameIndex = 0;
                            }
                        }
                    }
                    else {
                        break;
                    }
                    currentFrame = (frameList[this._currentFrameIndex]);
                    if (prevFrame) {
                        this._bone._arriveAtFrame(prevFrame, this, this._animationState, true);
                    }
                    this._currentFrameDuration = currentFrame.duration;
                    this._currentFramePosition = currentFrame.position;
                    prevFrame = currentFrame;
                }
                if (currentFrame) {
                    this._bone._arriveAtFrame(currentFrame, this, this._animationState, false);
                    this._blendEnabled = !isNaN(currentFrame.tweenEasing);
                    if (this._blendEnabled) {
                        this.updateToNextFrame(currentPlayTimes);
                    }
                    else {
                        this._tweenEasing = NaN;
                        this._tweenTransform = false;
                        this._tweenScale = false;
                        this._tweenColor = false;
                    }
                }
                if (this._blendEnabled) {
                    this.updateTween();
                }
            }
        };
        TimelineState.prototype.updateToNextFrame = function (currentPlayTimes) {
            if (currentPlayTimes === void 0) { currentPlayTimes = 0; }
            var nextFrameIndex = this._currentFrameIndex + 1;
            if (nextFrameIndex >= this._timelineData.frameList.length) {
                nextFrameIndex = 0;
            }
            var currentFrame = (this._timelineData.frameList[this._currentFrameIndex]);
            var nextFrame = (this._timelineData.frameList[nextFrameIndex]);
            var tweenEnabled = false;
            if (nextFrameIndex == 0 &&
                (!this._animationState.lastFrameAutoTween ||
                    (this._animationState.playTimes &&
                        this._animationState.currentPlayTimes >= this._animationState.playTimes &&
                        ((this._currentFramePosition + this._currentFrameDuration) / this._totalTime + currentPlayTimes - this._timelineData.offset) * this._timelineData.scale > 0.999999))) {
                this._tweenEasing = NaN;
                tweenEnabled = false;
            }
            else if (currentFrame.displayIndex < 0 || nextFrame.displayIndex < 0) {
                this._tweenEasing = NaN;
                tweenEnabled = false;
            }
            else if (this._animationState.autoTween) {
                this._tweenEasing = this._animationState.clip.tweenEasing;
                if (isNaN(this._tweenEasing)) {
                    this._tweenEasing = currentFrame.tweenEasing;
                    this._tweenCurve = currentFrame.curve;
                    if (isNaN(this._tweenEasing) && this._tweenCurve == null) {
                        tweenEnabled = false;
                    }
                    else {
                        if (this._tweenEasing == 10) {
                            this._tweenEasing = 0;
                        }
                        //_tweenEasing [-1, 0) 0 (0, 1] (1, 2]
                        tweenEnabled = true;
                    }
                }
                else {
                    //_tweenEasing [-1, 0) 0 (0, 1] (1, 2]
                    tweenEnabled = true;
                }
            }
            else {
                this._tweenEasing = currentFrame.tweenEasing;
                this._tweenCurve = currentFrame.curve;
                if ((isNaN(this._tweenEasing) || this._tweenEasing == 10) && this._tweenCurve == null) {
                    this._tweenEasing = NaN;
                    tweenEnabled = false;
                }
                else {
                    //_tweenEasing [-1, 0) 0 (0, 1] (1, 2]
                    tweenEnabled = true;
                }
            }
            if (tweenEnabled) {
                //transform
                this._durationTransform.x = nextFrame.transform.x - currentFrame.transform.x;
                this._durationTransform.y = nextFrame.transform.y - currentFrame.transform.y;
                this._durationTransform.skewX = nextFrame.transform.skewX - currentFrame.transform.skewX;
                this._durationTransform.skewY = nextFrame.transform.skewY - currentFrame.transform.skewY;
                this._durationTransform.scaleX = nextFrame.transform.scaleX - currentFrame.transform.scaleX + nextFrame.scaleOffset.x;
                this._durationTransform.scaleY = nextFrame.transform.scaleY - currentFrame.transform.scaleY + nextFrame.scaleOffset.y;
                this._durationTransform.normalizeRotation();
                if (nextFrameIndex == 0) {
                    this._durationTransform.skewX = dragonBones.TransformUtil.formatRadian(this._durationTransform.skewX);
                    this._durationTransform.skewY = dragonBones.TransformUtil.formatRadian(this._durationTransform.skewY);
                }
                this._durationPivot.x = nextFrame.pivot.x - currentFrame.pivot.x;
                this._durationPivot.y = nextFrame.pivot.y - currentFrame.pivot.y;
                if (this._durationTransform.x ||
                    this._durationTransform.y ||
                    this._durationTransform.skewX ||
                    this._durationTransform.skewY ||
                    this._durationTransform.scaleX ||
                    this._durationTransform.scaleY ||
                    this._durationPivot.x ||
                    this._durationPivot.y) {
                    this._tweenTransform = true;
                    this._tweenScale = currentFrame.tweenScale;
                }
                else {
                    this._tweenTransform = false;
                    this._tweenScale = false;
                }
            }
            else {
                this._tweenTransform = false;
                this._tweenScale = false;
            }
            if (!this._tweenTransform) {
                if (this._animationState.additiveBlending) {
                    this._transform.x = currentFrame.transform.x;
                    this._transform.y = currentFrame.transform.y;
                    this._transform.skewX = currentFrame.transform.skewX;
                    this._transform.skewY = currentFrame.transform.skewY;
                    this._transform.scaleX = currentFrame.transform.scaleX;
                    this._transform.scaleY = currentFrame.transform.scaleY;
                    this._pivot.x = currentFrame.pivot.x;
                    this._pivot.y = currentFrame.pivot.y;
                }
                else {
                    this._transform.x = this._originTransform.x + currentFrame.transform.x;
                    this._transform.y = this._originTransform.y + currentFrame.transform.y;
                    this._transform.skewX = this._originTransform.skewX + currentFrame.transform.skewX;
                    this._transform.skewY = this._originTransform.skewY + currentFrame.transform.skewY;
                    this._transform.scaleX = this._originTransform.scaleX * currentFrame.transform.scaleX;
                    this._transform.scaleY = this._originTransform.scaleY * currentFrame.transform.scaleY;
                    this._pivot.x = this._originPivot.x + currentFrame.pivot.x;
                    this._pivot.y = this._originPivot.y + currentFrame.pivot.y;
                }
                this._bone.invalidUpdate();
            }
            else if (!this._tweenScale) {
                if (this._animationState.additiveBlending) {
                    this._transform.scaleX = currentFrame.transform.scaleX;
                    this._transform.scaleY = currentFrame.transform.scaleY;
                }
                else {
                    this._transform.scaleX = this._originTransform.scaleX * currentFrame.transform.scaleX;
                    this._transform.scaleY = this._originTransform.scaleY * currentFrame.transform.scaleY;
                }
            }
        };
        TimelineState.prototype.updateTween = function () {
            var currentFrame = (this._timelineData.frameList[this._currentFrameIndex]);
            if (this._tweenTransform) {
                var progress = (this._currentTime - this._currentFramePosition) / this._currentFrameDuration;
                if (this._tweenCurve != null) {
                    progress = this._tweenCurve.getValueByProgress(progress);
                }
                else if (this._tweenEasing) {
                    progress = dragonBones.MathUtil.getEaseValue(progress, this._tweenEasing);
                }
                var currentTransform = currentFrame.transform;
                var currentPivot = currentFrame.pivot;
                if (this._animationState.additiveBlending) {
                    //additive blending
                    this._transform.x = currentTransform.x + this._durationTransform.x * progress;
                    this._transform.y = currentTransform.y + this._durationTransform.y * progress;
                    this._transform.skewX = currentTransform.skewX + this._durationTransform.skewX * progress;
                    this._transform.skewY = currentTransform.skewY + this._durationTransform.skewY * progress;
                    if (this._tweenScale) {
                        this._transform.scaleX = currentTransform.scaleX + this._durationTransform.scaleX * progress;
                        this._transform.scaleY = currentTransform.scaleY + this._durationTransform.scaleY * progress;
                    }
                    this._pivot.x = currentPivot.x + this._durationPivot.x * progress;
                    this._pivot.y = currentPivot.y + this._durationPivot.y * progress;
                }
                else {
                    //normal blending
                    this._transform.x = this._originTransform.x + currentTransform.x + this._durationTransform.x * progress;
                    this._transform.y = this._originTransform.y + currentTransform.y + this._durationTransform.y * progress;
                    this._transform.skewX = this._originTransform.skewX + currentTransform.skewX + this._durationTransform.skewX * progress;
                    this._transform.skewY = this._originTransform.skewY + currentTransform.skewY + this._durationTransform.skewY * progress;
                    if (this._tweenScale) {
                        this._transform.scaleX = this._originTransform.scaleX * currentTransform.scaleX + this._durationTransform.scaleX * progress;
                        this._transform.scaleY = this._originTransform.scaleY * currentTransform.scaleY + this._durationTransform.scaleY * progress;
                    }
                    this._pivot.x = this._originPivot.x + currentPivot.x + this._durationPivot.x * progress;
                    this._pivot.y = this._originPivot.y + currentPivot.y + this._durationPivot.y * progress;
                }
                this._bone.invalidUpdate();
            }
        };
        TimelineState.prototype.updateSingleFrame = function () {
            var currentFrame = (this._timelineData.frameList[0]);
            this._bone._arriveAtFrame(currentFrame, this, this._animationState, false);
            this._isComplete = true;
            this._tweenEasing = NaN;
            this._tweenTransform = false;
            this._tweenScale = false;
            this._tweenColor = false;
            this._blendEnabled = currentFrame.displayIndex >= 0;
            if (this._blendEnabled) {
                /**
                 * <使用绝对数据>
                 * 单帧的timeline，第一个关键帧的transform为0
                 * timeline.originTransform = firstFrame.transform;
                 * eachFrame.transform = eachFrame.transform - timeline.originTransform;
                 * firstFrame.transform == 0;
                 *
                 * <使用相对数据>
                 * 使用相对数据时，timeline.originTransform = 0，第一个关键帧的transform有可能不为 0
                 */
                if (this._animationState.additiveBlending) {
                    this._transform.x = currentFrame.transform.x;
                    this._transform.y = currentFrame.transform.y;
                    this._transform.skewX = currentFrame.transform.skewX;
                    this._transform.skewY = currentFrame.transform.skewY;
                    this._transform.scaleX = currentFrame.transform.scaleX;
                    this._transform.scaleY = currentFrame.transform.scaleY;
                    this._pivot.x = currentFrame.pivot.x;
                    this._pivot.y = currentFrame.pivot.y;
                }
                else {
                    this._transform.x = this._originTransform.x + currentFrame.transform.x;
                    this._transform.y = this._originTransform.y + currentFrame.transform.y;
                    this._transform.skewX = this._originTransform.skewX + currentFrame.transform.skewX;
                    this._transform.skewY = this._originTransform.skewY + currentFrame.transform.skewY;
                    this._transform.scaleX = this._originTransform.scaleX * currentFrame.transform.scaleX;
                    this._transform.scaleY = this._originTransform.scaleY * currentFrame.transform.scaleY;
                    this._pivot.x = this._originPivot.x + currentFrame.pivot.x;
                    this._pivot.y = this._originPivot.y + currentFrame.pivot.y;
                }
                this._bone.invalidUpdate();
            }
        };
        TimelineState.HALF_PI = Math.PI * 0.5;
        TimelineState.DOUBLE_PI = Math.PI * 2;
        TimelineState._pool = [];
        return TimelineState;
    })();
    dragonBones.TimelineState = TimelineState;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.SlotTimelineState
     * @classdesc
     * SlotTimelineState 负责计算 Slot 的时间轴动画。
     * SlotTimelineState 实例隶属于 AnimationState. AnimationState在创建时会为每个包含动作的 Slot生成一个 SlotTimelineState 实例.
     * @see dragonBones.Animation
     * @see dragonBones.AnimationState
     * @see dragonBones.Slot
     */
    var SlotTimelineState = (function () {
        function SlotTimelineState() {
            this._totalTime = 0; //duration
            this._currentTime = 0;
            this._currentFrameIndex = 0;
            this._currentFramePosition = 0;
            this._currentFrameDuration = 0;
            //-1: frameLength>1, 0:frameLength==0, 1:frameLength==1
            this._updateMode = 0;
            this._durationColor = new dragonBones.ColorTransform();
        }
        /** @private */
        SlotTimelineState._borrowObject = function () {
            if (SlotTimelineState._pool.length == 0) {
                return new SlotTimelineState();
            }
            return SlotTimelineState._pool.pop();
        };
        /** @private */
        SlotTimelineState._returnObject = function (timeline) {
            if (SlotTimelineState._pool.indexOf(timeline) < 0) {
                SlotTimelineState._pool[SlotTimelineState._pool.length] = timeline;
            }
            timeline.clear();
        };
        /** @private */
        SlotTimelineState._clear = function () {
            var i = SlotTimelineState._pool.length;
            while (i--) {
                SlotTimelineState._pool[i].clear();
            }
            SlotTimelineState._pool.length = 0;
        };
        SlotTimelineState.prototype.clear = function () {
            if (this._slot) {
                this._slot._removeState(this);
                this._slot = null;
            }
            this._armature = null;
            this._animation = null;
            this._animationState = null;
            this._timelineData = null;
        };
        //动画开始结束
        /** @private */
        SlotTimelineState.prototype._fadeIn = function (slot, animationState, timelineData) {
            this._slot = slot;
            this._armature = this._slot.armature;
            this._animation = this._armature.animation;
            this._animationState = animationState;
            this._timelineData = timelineData;
            this.name = timelineData.name;
            this._totalTime = this._timelineData.duration;
            this._rawAnimationScale = this._animationState.clip.scale;
            this._isComplete = false;
            this._blendEnabled = false;
            this._tweenColor = false;
            this._currentFrameIndex = -1;
            this._currentTime = -1;
            this._tweenEasing = NaN;
            this._weight = 1;
            switch (this._timelineData.frameList.length) {
                case 0:
                    this._updateMode = 0;
                    break;
                case 1:
                    this._updateMode = 1;
                    break;
                default:
                    this._updateMode = -1;
                    break;
            }
            this._slot._addState(this);
        };
        /** @private */
        SlotTimelineState.prototype._fadeOut = function () {
        };
        //动画进行中
        /** @private */
        SlotTimelineState.prototype._update = function (progress) {
            if (this._updateMode == -1) {
                this.updateMultipleFrame(progress);
            }
            else if (this._updateMode == 1) {
                this._updateMode = 0;
                this.updateSingleFrame();
            }
        };
        SlotTimelineState.prototype.updateMultipleFrame = function (progress) {
            var currentPlayTimes = 0;
            progress /= this._timelineData.scale;
            progress += this._timelineData.offset;
            var currentTime = this._totalTime * progress;
            var playTimes = this._animationState.playTimes;
            if (playTimes == 0) {
                this._isComplete = false;
                currentPlayTimes = Math.ceil(Math.abs(currentTime) / this._totalTime) || 1;
                if (currentTime >= 0) {
                    currentTime -= Math.floor(currentTime / this._totalTime) * this._totalTime;
                }
                else {
                    currentTime -= Math.ceil(currentTime / this._totalTime) * this._totalTime;
                }
                if (currentTime < 0) {
                    currentTime += this._totalTime;
                }
            }
            else {
                var totalTimes = playTimes * this._totalTime;
                if (currentTime >= totalTimes) {
                    currentTime = totalTimes;
                    this._isComplete = true;
                }
                else if (currentTime <= -totalTimes) {
                    currentTime = -totalTimes;
                    this._isComplete = true;
                }
                else {
                    this._isComplete = false;
                }
                if (currentTime < 0) {
                    currentTime += totalTimes;
                }
                currentPlayTimes = Math.ceil(currentTime / this._totalTime) || 1;
                if (this._isComplete) {
                    currentTime = this._totalTime;
                }
                else {
                    if (currentTime >= 0) {
                        currentTime -= Math.floor(currentTime / this._totalTime) * this._totalTime;
                    }
                    else {
                        currentTime -= Math.ceil(currentTime / this._totalTime) * this._totalTime;
                    }
                }
            }
            if (this._currentTime != currentTime) {
                this._currentTime = currentTime;
                var frameList = this._timelineData.frameList;
                var prevFrame;
                var currentFrame;
                for (var i = 0, l = this._timelineData.frameList.length; i < l; ++i) {
                    if (this._currentFrameIndex < 0) {
                        this._currentFrameIndex = 0;
                    }
                    else if (this._currentTime < this._currentFramePosition || this._currentTime >= this._currentFramePosition + this._currentFrameDuration) {
                        this._currentFrameIndex++;
                        if (this._currentFrameIndex >= frameList.length) {
                            if (this._isComplete) {
                                this._currentFrameIndex--;
                                break;
                            }
                            else {
                                this._currentFrameIndex = 0;
                            }
                        }
                    }
                    else {
                        break;
                    }
                    currentFrame = (frameList[this._currentFrameIndex]);
                    if (prevFrame) {
                        this._slot._arriveAtFrame(prevFrame, this, this._animationState, true);
                    }
                    this._currentFrameDuration = currentFrame.duration;
                    this._currentFramePosition = currentFrame.position;
                    prevFrame = currentFrame;
                }
                if (currentFrame) {
                    this._slot._arriveAtFrame(currentFrame, this, this._animationState, false);
                    this._blendEnabled = currentFrame.displayIndex >= 0;
                    if (this._blendEnabled) {
                        this.updateToNextFrame(currentPlayTimes);
                    }
                    else {
                        this._tweenEasing = NaN;
                        this._tweenColor = false;
                    }
                }
                if (this._blendEnabled) {
                    this.updateTween();
                }
            }
        };
        SlotTimelineState.prototype.updateToNextFrame = function (currentPlayTimes) {
            if (currentPlayTimes === void 0) { currentPlayTimes = 0; }
            var nextFrameIndex = this._currentFrameIndex + 1;
            if (nextFrameIndex >= this._timelineData.frameList.length) {
                nextFrameIndex = 0;
            }
            var currentFrame = (this._timelineData.frameList[this._currentFrameIndex]);
            var nextFrame = (this._timelineData.frameList[nextFrameIndex]);
            var tweenEnabled = false;
            if (nextFrameIndex == 0 &&
                (!this._animationState.lastFrameAutoTween ||
                    (this._animationState.playTimes &&
                        this._animationState.currentPlayTimes >= this._animationState.playTimes &&
                        ((this._currentFramePosition + this._currentFrameDuration) / this._totalTime + currentPlayTimes - this._timelineData.offset) * this._timelineData.scale > 0.999999))) {
                this._tweenEasing = NaN;
                tweenEnabled = false;
            }
            else if (currentFrame.displayIndex < 0 || nextFrame.displayIndex < 0) {
                this._tweenEasing = NaN;
                tweenEnabled = false;
            }
            else if (this._animationState.autoTween) {
                this._tweenEasing = this._animationState.clip.tweenEasing;
                if (isNaN(this._tweenEasing)) {
                    this._tweenEasing = currentFrame.tweenEasing;
                    this._tweenCurve = currentFrame.curve;
                    if (isNaN(this._tweenEasing) && this._tweenCurve == null) {
                        tweenEnabled = false;
                    }
                    else {
                        if (this._tweenEasing == 10) {
                            this._tweenEasing = 0;
                        }
                        //_tweenEasing [-1, 0) 0 (0, 1] (1, 2]
                        tweenEnabled = true;
                    }
                }
                else {
                    //_tweenEasing [-1, 0) 0 (0, 1] (1, 2]
                    tweenEnabled = true;
                }
            }
            else {
                this._tweenEasing = currentFrame.tweenEasing;
                this._tweenCurve = currentFrame.curve;
                if ((isNaN(this._tweenEasing) || this._tweenEasing == 10) && this._tweenCurve == null) {
                    this._tweenEasing = NaN;
                    tweenEnabled = false;
                }
                else {
                    //_tweenEasing [-1, 0) 0 (0, 1] (1, 2]
                    tweenEnabled = true;
                }
            }
            if (tweenEnabled) {
                //color
                if (currentFrame.color && nextFrame.color) {
                    this._durationColor.alphaOffset = nextFrame.color.alphaOffset - currentFrame.color.alphaOffset;
                    this._durationColor.redOffset = nextFrame.color.redOffset - currentFrame.color.redOffset;
                    this._durationColor.greenOffset = nextFrame.color.greenOffset - currentFrame.color.greenOffset;
                    this._durationColor.blueOffset = nextFrame.color.blueOffset - currentFrame.color.blueOffset;
                    this._durationColor.alphaMultiplier = nextFrame.color.alphaMultiplier - currentFrame.color.alphaMultiplier;
                    this._durationColor.redMultiplier = nextFrame.color.redMultiplier - currentFrame.color.redMultiplier;
                    this._durationColor.greenMultiplier = nextFrame.color.greenMultiplier - currentFrame.color.greenMultiplier;
                    this._durationColor.blueMultiplier = nextFrame.color.blueMultiplier - currentFrame.color.blueMultiplier;
                    if (this._durationColor.alphaOffset ||
                        this._durationColor.redOffset ||
                        this._durationColor.greenOffset ||
                        this._durationColor.blueOffset ||
                        this._durationColor.alphaMultiplier ||
                        this._durationColor.redMultiplier ||
                        this._durationColor.greenMultiplier ||
                        this._durationColor.blueMultiplier) {
                        this._tweenColor = true;
                    }
                    else {
                        this._tweenColor = false;
                    }
                }
                else if (currentFrame.color) {
                    this._tweenColor = true;
                    this._durationColor.alphaOffset = -currentFrame.color.alphaOffset;
                    this._durationColor.redOffset = -currentFrame.color.redOffset;
                    this._durationColor.greenOffset = -currentFrame.color.greenOffset;
                    this._durationColor.blueOffset = -currentFrame.color.blueOffset;
                    this._durationColor.alphaMultiplier = 1 - currentFrame.color.alphaMultiplier;
                    this._durationColor.redMultiplier = 1 - currentFrame.color.redMultiplier;
                    this._durationColor.greenMultiplier = 1 - currentFrame.color.greenMultiplier;
                    this._durationColor.blueMultiplier = 1 - currentFrame.color.blueMultiplier;
                }
                else if (nextFrame.color) {
                    this._tweenColor = true;
                    this._durationColor.alphaOffset = nextFrame.color.alphaOffset;
                    this._durationColor.redOffset = nextFrame.color.redOffset;
                    this._durationColor.greenOffset = nextFrame.color.greenOffset;
                    this._durationColor.blueOffset = nextFrame.color.blueOffset;
                    this._durationColor.alphaMultiplier = nextFrame.color.alphaMultiplier - 1;
                    this._durationColor.redMultiplier = nextFrame.color.redMultiplier - 1;
                    this._durationColor.greenMultiplier = nextFrame.color.greenMultiplier - 1;
                    this._durationColor.blueMultiplier = nextFrame.color.blueMultiplier - 1;
                }
                else {
                    this._tweenColor = false;
                }
            }
            else {
                this._tweenColor = false;
            }
            if (!this._tweenColor && this._animationState.displayControl) {
                if (currentFrame.color) {
                    this._slot._updateDisplayColor(currentFrame.color.alphaOffset, currentFrame.color.redOffset, currentFrame.color.greenOffset, currentFrame.color.blueOffset, currentFrame.color.alphaMultiplier, currentFrame.color.redMultiplier, currentFrame.color.greenMultiplier, currentFrame.color.blueMultiplier, true);
                }
                else if (this._slot._isColorChanged) {
                    this._slot._updateDisplayColor(0, 0, 0, 0, 1, 1, 1, 1, false);
                }
            }
        };
        SlotTimelineState.prototype.updateTween = function () {
            var currentFrame = (this._timelineData.frameList[this._currentFrameIndex]);
            if (this._tweenColor && this._animationState.displayControl) {
                var progress = (this._currentTime - this._currentFramePosition) / this._currentFrameDuration;
                if (this._tweenCurve != null) {
                    progress = this._tweenCurve.getValueByProgress(progress);
                }
                else if (this._tweenEasing) {
                    progress = dragonBones.MathUtil.getEaseValue(progress, this._tweenEasing);
                }
                if (currentFrame.color) {
                    this._slot._updateDisplayColor(currentFrame.color.alphaOffset + this._durationColor.alphaOffset * progress, currentFrame.color.redOffset + this._durationColor.redOffset * progress, currentFrame.color.greenOffset + this._durationColor.greenOffset * progress, currentFrame.color.blueOffset + this._durationColor.blueOffset * progress, currentFrame.color.alphaMultiplier + this._durationColor.alphaMultiplier * progress, currentFrame.color.redMultiplier + this._durationColor.redMultiplier * progress, currentFrame.color.greenMultiplier + this._durationColor.greenMultiplier * progress, currentFrame.color.blueMultiplier + this._durationColor.blueMultiplier * progress, true);
                }
                else {
                    this._slot._updateDisplayColor(this._durationColor.alphaOffset * progress, this._durationColor.redOffset * progress, this._durationColor.greenOffset * progress, this._durationColor.blueOffset * progress, 1 + this._durationColor.alphaMultiplier * progress, 1 + this._durationColor.redMultiplier * progress, 1 + this._durationColor.greenMultiplier * progress, 1 + this._durationColor.blueMultiplier * progress, true);
                }
            }
        };
        SlotTimelineState.prototype.updateSingleFrame = function () {
            var currentFrame = (this._timelineData.frameList[0]);
            this._slot._arriveAtFrame(currentFrame, this, this._animationState, false);
            this._isComplete = true;
            this._tweenEasing = NaN;
            this._tweenColor = false;
            this._blendEnabled = currentFrame.displayIndex >= 0;
            if (this._blendEnabled) {
                /**
                 * <使用绝对数据>
                 * 单帧的timeline，第一个关键帧的transform为0
                 * timeline.originTransform = firstFrame.transform;
                 * eachFrame.transform = eachFrame.transform - timeline.originTransform;
                 * firstFrame.transform == 0;
                 *
                 * <使用相对数据>
                 * 使用相对数据时，timeline.originTransform = 0，第一个关键帧的transform有可能不为 0
                 */
                if (this._animationState.displayControl) {
                    if (currentFrame.color) {
                        this._slot._updateDisplayColor(currentFrame.color.alphaOffset, currentFrame.color.redOffset, currentFrame.color.greenOffset, currentFrame.color.blueOffset, currentFrame.color.alphaMultiplier, currentFrame.color.redMultiplier, currentFrame.color.greenMultiplier, currentFrame.color.blueMultiplier, true);
                    }
                    else if (this._slot._isColorChanged) {
                        this._slot._updateDisplayColor(0, 0, 0, 0, 1, 1, 1, 1, false);
                    }
                }
            }
        };
        SlotTimelineState.HALF_PI = Math.PI * 0.5;
        SlotTimelineState.DOUBLE_PI = Math.PI * 2;
        SlotTimelineState._pool = [];
        return SlotTimelineState;
    })();
    dragonBones.SlotTimelineState = SlotTimelineState;
})(dragonBones || (dragonBones = {})); //////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.AnimationState
     * @classdesc
     * AnimationState 实例由 Animation 实例播放动画时产生， 可以对单个动画的播放进行最细致的调节。
     * @see dragonBones.Animation
     * @see dragonBones.AnimationData
     *
     * @example
       <pre>
        //获取动画数据
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");
      
        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
      
        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[0].name;
        //从工厂里创建出Armature
        var armature:dragonBones.Armature = factory.buildArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        armatureDisplay.x = 200;
        armatureDisplay.y = 500;
        //把它添加到舞台上
        this.addChild(armatureDisplay);
      
        //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName:string = armature.animation.animationList[0];
        //播放这个动画
        armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);
      
        //获取animationState可以对动画进行更多控制；
        var animationState:dragonBones.AnimationState = armature.animation.getState(curAnimationName);
      
        //下面的代码实现人物的脖子和头动，但是其他部位不动
        animationState.addBoneMask("neck",true);
        //下面的代码实现人物的身体动，但是脖子和头不动
        //animationState.addBoneMask("hip",true);//“hip”是骨架的根骨骼的名字
        //animationState.removeBoneMask("neck",true);
        //下面的代码实现动画幅度减小的效果
        //animationState.weight = 0.5;
      
        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
           dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
       </pre>
     */
    var AnimationState = (function () {
        function AnimationState() {
            /** @private */
            this._layer = 0;
            this._currentFrameIndex = 0;
            this._currentFramePosition = 0;
            this._currentFrameDuration = 0;
            this._currentPlayTimes = 0;
            this._totalTime = 0;
            this._currentTime = 0;
            this._lastTime = 0;
            //-1 beforeFade, 0 fading, 1 fadeComplete
            this._fadeState = 0;
            this._playTimes = 0;
            this._timelineStateList = [];
            this._slotTimelineStateList = [];
            this._boneMasks = [];
        }
        /** @private */
        AnimationState._borrowObject = function () {
            if (AnimationState._pool.length == 0) {
                return new AnimationState();
            }
            return AnimationState._pool.pop();
        };
        /** @private */
        AnimationState._returnObject = function (animationState) {
            animationState.clear();
            if (AnimationState._pool.indexOf(animationState) < 0) {
                AnimationState._pool[AnimationState._pool.length] = animationState;
            }
        };
        /** @private */
        AnimationState._clear = function () {
            var i = AnimationState._pool.length;
            while (i--) {
                AnimationState._pool[i].clear();
            }
            AnimationState._pool.length = 0;
            dragonBones.TimelineState._clear();
        };
        AnimationState.prototype.clear = function () {
            this._resetTimelineStateList();
            this._boneMasks.length = 0;
            this._armature = null;
            this._clip = null;
        };
        AnimationState.prototype._resetTimelineStateList = function () {
            var i = this._timelineStateList.length;
            while (i--) {
                dragonBones.TimelineState._returnObject(this._timelineStateList[i]);
            }
            this._timelineStateList.length = 0;
            i = this._slotTimelineStateList.length;
            while (i--) {
                dragonBones.SlotTimelineState._returnObject(this._slotTimelineStateList[i]);
            }
            this._slotTimelineStateList.length = 0;
        };
        //骨架装配
        /**
         * 检查指定名称的骨头是否在遮罩中。只有在遮罩中的骨头动画才会被播放
         * @param boneName {string} dragonBones.AnimationState#containsBoneMask
         * @returns {boolean}
         */
        AnimationState.prototype.containsBoneMask = function (boneName) {
            return this._boneMasks.length == 0 || this._boneMasks.indexOf(boneName) >= 0;
        };
        /**
         * 将一个骨头加入遮罩。只有加入遮罩的骨头的动画才会被播放，如果没有骨头加入遮罩，则所有骨头的动画都会播放。通过这个API可以实现只播放角色的一部分.
         * @param boneName {string} 骨头名称.
         * @param ifInvolveChildBones {boolean} 是否影响子骨头。默认值：true.
         * @returns {AnimationState} 动画播放状态实例
         */
        AnimationState.prototype.addBoneMask = function (boneName, ifInvolveChildBones) {
            if (ifInvolveChildBones === void 0) { ifInvolveChildBones = true; }
            this.addBoneToBoneMask(boneName);
            if (ifInvolveChildBones) {
                var currentBone = this._armature.getBone(boneName);
                if (currentBone) {
                    var boneList = this._armature.getBones(false);
                    var i = boneList.length;
                    while (i--) {
                        var tempBone = boneList[i];
                        if (currentBone.contains(tempBone)) {
                            this.addBoneToBoneMask(tempBone.name);
                        }
                    }
                }
            }
            this._updateTimelineStates();
            return this;
        };
        /**
         * 将一个指定名称的骨头从遮罩中移除.
         * @param boneName {string} 骨头名称.
         * @param ifInvolveChildBones {boolean} 是否影响子骨头。默认值：true.
         * @returns {AnimationState} 动画播放状态实例
         */
        AnimationState.prototype.removeBoneMask = function (boneName, ifInvolveChildBones) {
            if (ifInvolveChildBones === void 0) { ifInvolveChildBones = true; }
            this.removeBoneFromBoneMask(boneName);
            if (ifInvolveChildBones) {
                var currentBone = this._armature.getBone(boneName);
                if (currentBone) {
                    var boneList = this._armature.getBones(false);
                    var i = boneList.length;
                    while (i--) {
                        var tempBone = boneList[i];
                        if (currentBone.contains(tempBone)) {
                            this.removeBoneFromBoneMask(tempBone.name);
                        }
                    }
                }
            }
            this._updateTimelineStates();
            return this;
        };
        /**
         * 清空骨头遮罩.
         * @returns {AnimationState} 动画播放状态实例
         */
        AnimationState.prototype.removeAllMixingTransform = function () {
            this._boneMasks.length = 0;
            this._updateTimelineStates();
            return this;
        };
        AnimationState.prototype.addBoneToBoneMask = function (boneName) {
            if (this._clip.getTimeline(boneName) && this._boneMasks.indexOf(boneName) < 0) {
                this._boneMasks.push(boneName);
            }
        };
        AnimationState.prototype.removeBoneFromBoneMask = function (boneName) {
            var index = this._boneMasks.indexOf(boneName);
            if (index >= 0) {
                this._boneMasks.splice(index, 1);
            }
        };
        /**
         * @private
         * Update timeline state based on mixing transforms and clip.
         */
        AnimationState.prototype._updateTimelineStates = function () {
            var timelineState;
            var slotTimelineState;
            var i = this._timelineStateList.length;
            var len;
            while (i--) {
                timelineState = this._timelineStateList[i];
                if (!this._armature.getBone(timelineState.name)) {
                    this.removeTimelineState(timelineState);
                }
            }
            i = this._slotTimelineStateList.length;
            while (i--) {
                slotTimelineState = this._slotTimelineStateList[i];
                if (!this._armature.getSlot(slotTimelineState.name)) {
                    this.removeSlotTimelineState(slotTimelineState);
                }
            }
            if (this._boneMasks.length > 0) {
                i = this._timelineStateList.length;
                while (i--) {
                    timelineState = this._timelineStateList[i];
                    if (this._boneMasks.indexOf(timelineState.name) < 0) {
                        this.removeTimelineState(timelineState);
                    }
                }
                for (i = 0, len = this._boneMasks.length; i < len; i++) {
                    var timelineName = this._boneMasks[i];
                    this.addTimelineState(timelineName);
                }
            }
            else {
                for (i = 0, len = this._clip.timelineList.length; i < len; i++) {
                    var timeline = this._clip.timelineList[i];
                    this.addTimelineState(timeline.name);
                }
            }
            for (i = 0, len = this._clip.slotTimelineList.length; i < len; i++) {
                var slotTimeline = this._clip.slotTimelineList[i];
                this.addSlotTimelineState(slotTimeline.name);
            }
        };
        AnimationState.prototype.addTimelineState = function (timelineName) {
            var bone = this._armature.getBone(timelineName);
            if (bone) {
                for (var i = 0, len = this._timelineStateList.length; i < len; i++) {
                    var eachState = this._timelineStateList[i];
                    if (eachState.name == timelineName) {
                        return;
                    }
                }
                var timelineState = dragonBones.TimelineState._borrowObject();
                timelineState._fadeIn(bone, this, this._clip.getTimeline(timelineName));
                this._timelineStateList.push(timelineState);
            }
        };
        AnimationState.prototype.removeTimelineState = function (timelineState) {
            var index = this._timelineStateList.indexOf(timelineState);
            this._timelineStateList.splice(index, 1);
            dragonBones.TimelineState._returnObject(timelineState);
        };
        AnimationState.prototype.addSlotTimelineState = function (timelineName) {
            var slot = this._armature.getSlot(timelineName);
            if (slot) {
                for (var i = 0, len = this._slotTimelineStateList.length; i < len; i++) {
                    var eachState = this._slotTimelineStateList[i];
                    if (eachState.name == timelineName) {
                        return;
                    }
                }
                var timelineState = dragonBones.SlotTimelineState._borrowObject();
                timelineState._fadeIn(slot, this, this._clip.getSlotTimeline(timelineName));
                this._slotTimelineStateList.push(timelineState);
            }
        };
        AnimationState.prototype.removeSlotTimelineState = function (timelineState) {
            var index = this._slotTimelineStateList.indexOf(timelineState);
            this._slotTimelineStateList.splice(index, 1);
            dragonBones.SlotTimelineState._returnObject(timelineState);
        };
        //动画
        /**
         * 播放当前动画。如果动画已经播放完毕, 将不会继续播放.
         * @returns {AnimationState} 动画播放状态实例
         */
        AnimationState.prototype.play = function () {
            this._isPlaying = true;
            return this;
        };
        /**
         * 暂停当前动画的播放。
         * @returns {AnimationState} 动画播放状态实例
         */
        AnimationState.prototype.stop = function () {
            this._isPlaying = false;
            return this;
        };
        /** @private */
        AnimationState.prototype._fadeIn = function (armature, clip, fadeTotalTime, timeScale, playTimes, pausePlayhead) {
            this._armature = armature;
            this._clip = clip;
            this._pausePlayheadInFade = pausePlayhead;
            this._name = this._clip.name;
            this._totalTime = this._clip.duration;
            this.autoTween = this._clip.autoTween;
            this.setTimeScale(timeScale);
            this.setPlayTimes(playTimes);
            //reset
            this._isComplete = false;
            this._currentFrameIndex = -1;
            this._currentPlayTimes = -1;
            if (Math.round(this._totalTime * this._clip.frameRate * 0.001) < 2 || timeScale == Infinity) {
                this._currentTime = this._totalTime;
            }
            else {
                this._currentTime = -1;
            }
            this._time = 0;
            this._boneMasks.length = 0;
            //fade start
            this._isFadeOut = false;
            this._fadeWeight = 0;
            this._fadeTotalWeight = 1;
            this._fadeState = -1;
            this._fadeCurrentTime = 0;
            this._fadeBeginTime = this._fadeCurrentTime;
            this._fadeTotalTime = fadeTotalTime * this._timeScale;
            //default
            this._isPlaying = true;
            this.displayControl = true;
            this.lastFrameAutoTween = true;
            this.additiveBlending = false;
            this.weight = 1;
            this.fadeOutTime = fadeTotalTime;
            this._updateTimelineStates();
            return this;
        };
        /**
         * 淡出当前动画
         * @param fadeTotalTime {number} 淡出时间
         * @param pausePlayhead {boolean} 淡出时动画是否暂停。
         */
        AnimationState.prototype.fadeOut = function (fadeTotalTime, pausePlayhead) {
            if (!this._armature) {
                return null;
            }
            if (isNaN(fadeTotalTime) || fadeTotalTime < 0) {
                fadeTotalTime = 0;
            }
            this._pausePlayheadInFade = pausePlayhead;
            if (this._isFadeOut) {
                if (fadeTotalTime > this._fadeTotalTime / this._timeScale - (this._fadeCurrentTime - this._fadeBeginTime)) {
                    //如果已经在淡出中，新的淡出需要更长的淡出时间，则忽略
                    //If the animation is already in fade out, the new fade out will be ignored.
                    return this;
                }
            }
            else {
                //第一次淡出
                //The first time to fade out.
                for (var i = 0, len = this._timelineStateList.length; i < len; i++) {
                    var timelineState = this._timelineStateList[i];
                    timelineState._fadeOut();
                }
            }
            //fade start
            this._isFadeOut = true;
            this._fadeTotalWeight = this._fadeWeight;
            this._fadeState = -1;
            this._fadeBeginTime = this._fadeCurrentTime;
            this._fadeTotalTime = this._fadeTotalWeight >= 0 ? fadeTotalTime * this._timeScale : 0;
            //default
            this.displayControl = false;
            return this;
        };
        /** @private */
        AnimationState.prototype._advanceTime = function (passedTime) {
            passedTime *= this._timeScale;
            this.advanceFadeTime(passedTime);
            if (this._fadeWeight) {
                this.advanceTimelinesTime(passedTime);
            }
            return this._isFadeOut && this._fadeState == 1;
        };
        AnimationState.prototype.advanceFadeTime = function (passedTime) {
            var fadeStartFlg = false;
            var fadeCompleteFlg = false;
            if (this._fadeBeginTime >= 0) {
                var fadeState = this._fadeState;
                this._fadeCurrentTime += passedTime < 0 ? -passedTime : passedTime;
                if (this._fadeCurrentTime >= this._fadeBeginTime + this._fadeTotalTime) {
                    //fade完全结束之后触发 
                    //TODO 研究明白为什么要下次再触发
                    if (this._fadeWeight == 1 ||
                        this._fadeWeight == 0) {
                        fadeState = 1;
                        if (this._pausePlayheadInFade) {
                            this._pausePlayheadInFade = false;
                            this._currentTime = -1;
                        }
                    }
                    this._fadeWeight = this._isFadeOut ? 0 : 1;
                }
                else if (this._fadeCurrentTime >= this._fadeBeginTime) {
                    //fading
                    fadeState = 0;
                    //暂时只支持线性淡入淡出
                    //Currently only support Linear fadein and fadeout
                    this._fadeWeight = (this._fadeCurrentTime - this._fadeBeginTime) / this._fadeTotalTime * this._fadeTotalWeight;
                    if (this._isFadeOut) {
                        this._fadeWeight = this._fadeTotalWeight - this._fadeWeight;
                    }
                }
                else {
                    //before fade
                    fadeState = -1;
                    this._fadeWeight = this._isFadeOut ? 1 : 0;
                }
                if (this._fadeState != fadeState) {
                    //_fadeState == -1 && (fadeState == 0 || fadeState == 1)
                    if (this._fadeState == -1) {
                        fadeStartFlg = true;
                    }
                    //(_fadeState == -1 || _fadeState == 0) && fadeState == 1
                    if (fadeState == 1) {
                        fadeCompleteFlg = true;
                    }
                    this._fadeState = fadeState;
                }
            }
            var event;
            if (fadeStartFlg) {
                if (this._isFadeOut) {
                    if (this._armature.hasEventListener(dragonBones.AnimationEvent.FADE_OUT)) {
                        event = new dragonBones.AnimationEvent(dragonBones.AnimationEvent.FADE_OUT);
                        event.animationState = this;
                        this._armature._eventList.push(event);
                    }
                }
                else {
                    //动画开始，先隐藏不需要的骨头
                    this.hideBones();
                    if (this._armature.hasEventListener(dragonBones.AnimationEvent.FADE_IN)) {
                        event = new dragonBones.AnimationEvent(dragonBones.AnimationEvent.FADE_IN);
                        event.animationState = this;
                        this._armature._eventList.push(event);
                    }
                }
            }
            if (fadeCompleteFlg) {
                if (this._isFadeOut) {
                    if (this._armature.hasEventListener(dragonBones.AnimationEvent.FADE_OUT_COMPLETE)) {
                        event = new dragonBones.AnimationEvent(dragonBones.AnimationEvent.FADE_OUT_COMPLETE);
                        event.animationState = this;
                        this._armature._eventList.push(event);
                    }
                }
                else {
                    if (this._armature.hasEventListener(dragonBones.AnimationEvent.FADE_IN_COMPLETE)) {
                        event = new dragonBones.AnimationEvent(dragonBones.AnimationEvent.FADE_IN_COMPLETE);
                        event.animationState = this;
                        this._armature._eventList.push(event);
                    }
                }
            }
        };
        AnimationState.prototype.advanceTimelinesTime = function (passedTime) {
            if (this._isPlaying && !this._pausePlayheadInFade) {
                this._time += passedTime;
            }
            var startFlg = false;
            var completeFlg = false;
            var loopCompleteFlg = false;
            var isThisComplete = false;
            var currentPlayTimes = 0;
            var currentTime = this._time * 1000;
            if (this._playTimes == 0) {
                isThisComplete = false;
                currentPlayTimes = Math.ceil(Math.abs(currentTime) / this._totalTime) || 1;
                if (currentTime >= 0) {
                    currentTime -= Math.floor(currentTime / this._totalTime) * this._totalTime;
                }
                else {
                    currentTime -= Math.ceil(currentTime / this._totalTime) * this._totalTime;
                }
                if (currentTime < 0) {
                    currentTime += this._totalTime;
                }
            }
            else {
                var totalTimes = this._playTimes * this._totalTime;
                if (currentTime >= totalTimes) {
                    currentTime = totalTimes;
                    isThisComplete = true;
                }
                else if (currentTime <= -totalTimes) {
                    currentTime = -totalTimes;
                    isThisComplete = true;
                }
                else {
                    isThisComplete = false;
                }
                if (currentTime < 0) {
                    currentTime += totalTimes;
                }
                currentPlayTimes = Math.ceil(currentTime / this._totalTime) || 1;
                if (currentTime >= 0) {
                    currentTime -= Math.floor(currentTime / this._totalTime) * this._totalTime;
                }
                else {
                    currentTime -= Math.ceil(currentTime / this._totalTime) * this._totalTime;
                }
                if (isThisComplete) {
                    currentTime = this._totalTime;
                }
            }
            //update timeline
            this._isComplete = isThisComplete;
            var progress = this._time * 1000 / this._totalTime;
            var i = 0;
            var len = 0;
            for (i = 0, len = this._timelineStateList.length; i < len; i++) {
                var timeline = this._timelineStateList[i];
                timeline._update(progress);
                this._isComplete = timeline._isComplete && this._isComplete;
            }
            for (i = 0, len = this._slotTimelineStateList.length; i < len; i++) {
                var slotTimeline = this._slotTimelineStateList[i];
                slotTimeline._update(progress);
                this._isComplete = timeline._isComplete && this._isComplete;
            }
            //update main timeline
            if (this._currentTime != currentTime) {
                if (this._currentPlayTimes != currentPlayTimes) {
                    if (this._currentPlayTimes > 0 && currentPlayTimes > 1) {
                        loopCompleteFlg = true;
                    }
                    this._currentPlayTimes = currentPlayTimes;
                }
                if (this._currentTime < 0) {
                    startFlg = true;
                }
                if (this._isComplete) {
                    completeFlg = true;
                }
                this._lastTime = this._currentTime;
                this._currentTime = currentTime;
                /*
                if(isThisComplete)
                {
                currentTime = _totalTime * 0.999999;
                }
                //[0, _totalTime)
                */
                this.updateMainTimeline(isThisComplete);
            }
            var event;
            if (startFlg) {
                if (this._armature.hasEventListener(dragonBones.AnimationEvent.START)) {
                    event = new dragonBones.AnimationEvent(dragonBones.AnimationEvent.START);
                    event.animationState = this;
                    this._armature._eventList.push(event);
                }
            }
            if (completeFlg) {
                if (this._armature.hasEventListener(dragonBones.AnimationEvent.COMPLETE)) {
                    event = new dragonBones.AnimationEvent(dragonBones.AnimationEvent.COMPLETE);
                    event.animationState = this;
                    this._armature._eventList.push(event);
                }
                if (this.autoFadeOut) {
                    this.fadeOut(this.fadeOutTime, true);
                }
            }
            else if (loopCompleteFlg) {
                if (this._armature.hasEventListener(dragonBones.AnimationEvent.LOOP_COMPLETE)) {
                    event = new dragonBones.AnimationEvent(dragonBones.AnimationEvent.LOOP_COMPLETE);
                    event.animationState = this;
                    this._armature._eventList.push(event);
                }
            }
        };
        AnimationState.prototype.updateMainTimeline = function (isThisComplete) {
            var frameList = this._clip.frameList;
            if (frameList.length > 0) {
                var prevFrame;
                var currentFrame;
                for (var i = 0, l = this._clip.frameList.length; i < l; ++i) {
                    if (this._currentFrameIndex < 0) {
                        this._currentFrameIndex = 0;
                    }
                    else if (this._currentTime < this._currentFramePosition || this._currentTime >= this._currentFramePosition + this._currentFrameDuration || this._currentTime < this._lastTime) {
                        this._currentFrameIndex++;
                        this._lastTime = this._currentTime;
                        if (this._currentFrameIndex >= frameList.length) {
                            if (isThisComplete) {
                                this._currentFrameIndex--;
                                break;
                            }
                            else {
                                this._currentFrameIndex = 0;
                            }
                        }
                    }
                    else {
                        break;
                    }
                    currentFrame = frameList[this._currentFrameIndex];
                    if (prevFrame) {
                        this._armature._arriveAtFrame(prevFrame, null, this, true);
                    }
                    this._currentFrameDuration = currentFrame.duration;
                    this._currentFramePosition = currentFrame.position;
                    prevFrame = currentFrame;
                }
                if (currentFrame) {
                    this._armature._arriveAtFrame(currentFrame, null, this, false);
                }
            }
        };
        AnimationState.prototype.hideBones = function () {
            for (var i = 0, len = this._clip.hideTimelineNameMap.length; i < len; i++) {
                var timelineName = this._clip.hideTimelineNameMap[i];
                var bone = this._armature.getBone(timelineName);
                if (bone) {
                    bone._hideSlots();
                }
            }
            var slotTimelineName;
            for (i = 0, len = this._clip.hideSlotTimelineNameMap.length; i < len; i++) {
                slotTimelineName = this._clip.hideSlotTimelineNameMap[i];
                var slot = this._armature.getSlot(slotTimelineName);
                if (slot) {
                    slot._resetToOrigin();
                }
            }
        };
        //属性访问
        AnimationState.prototype.setAdditiveBlending = function (value) {
            this.additiveBlending = value;
            return this;
        };
        AnimationState.prototype.setAutoFadeOut = function (value, fadeOutTime) {
            if (fadeOutTime === void 0) { fadeOutTime = -1; }
            this.autoFadeOut = value;
            if (fadeOutTime >= 0) {
                this.fadeOutTime = fadeOutTime * this._timeScale;
            }
            return this;
        };
        AnimationState.prototype.setWeight = function (value) {
            if (isNaN(value) || value < 0) {
                value = 1;
            }
            this.weight = value;
            return this;
        };
        AnimationState.prototype.setFrameTween = function (autoTween, lastFrameAutoTween) {
            this.autoTween = autoTween;
            this.lastFrameAutoTween = lastFrameAutoTween;
            return this;
        };
        AnimationState.prototype.setCurrentTime = function (value) {
            if (value < 0 || isNaN(value)) {
                value = 0;
            }
            this._time = value;
            this._currentTime = this._time * 1000;
            return this;
        };
        AnimationState.prototype.setTimeScale = function (value) {
            if (isNaN(value) || value == Infinity) {
                value = 1;
            }
            this._timeScale = value;
            return this;
        };
        AnimationState.prototype.setPlayTimes = function (value) {
            if (value === void 0) { value = 0; }
            //如果动画只有一帧  播放一次就可以
            if (Math.round(this._totalTime * 0.001 * this._clip.frameRate) < 2) {
                this._playTimes = value < 0 ? -1 : 1;
            }
            else {
                this._playTimes = value < 0 ? -value : value;
            }
            this.autoFadeOut = value < 0 ? true : false;
            return this;
        };
        Object.defineProperty(AnimationState.prototype, "name", {
            /**
             * 动画的名字
             * @member {string} dragonBones.AnimationState#name
             */
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "layer", {
            /**
             * 动画所在的层
             * @member {number} dragonBones.AnimationState#layer
             */
            get: function () {
                return this._layer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "group", {
            /**
             * 动画所在的组
             * @member {string} dragonBones.AnimationState#group
             */
            get: function () {
                return this._group;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "clip", {
            /**
             * 动画包含的动画数据
             * @member {AnimationData} dragonBones.AnimationState#clip
             */
            get: function () {
                return this._clip;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "isComplete", {
            /**
             * 是否播放完成
             * @member {boolean} dragonBones.AnimationState#isComplete
             */
            get: function () {
                return this._isComplete;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "isPlaying", {
            /**
             * 是否正在播放
             * @member {boolean} dragonBones.AnimationState#isPlaying
             */
            get: function () {
                return (this._isPlaying && !this._isComplete);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "currentPlayTimes", {
            /**
             * 当前播放次数
             * @member {number} dragonBones.AnimationState#currentPlayTimes
             */
            get: function () {
                return this._currentPlayTimes < 0 ? 0 : this._currentPlayTimes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "totalTime", {
            /**
             * 动画总时长（单位：秒）
             * @member {number} dragonBones.AnimationState#totalTime
             */
            get: function () {
                return this._totalTime * 0.001;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "currentTime", {
            /**
             * 动画当前播放时间（单位：秒）
             * @member {number} dragonBones.AnimationState#currentTime
             */
            get: function () {
                return this._currentTime < 0 ? 0 : this._currentTime * 0.001;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "fadeWeight", {
            get: function () {
                return this._fadeWeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "fadeState", {
            get: function () {
                return this._fadeState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "fadeTotalTime", {
            get: function () {
                return this._fadeTotalTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "timeScale", {
            /**
             * 时间缩放系数。用于调节动画播放速度
             * @member {number} dragonBones.AnimationState#timeScale
             */
            get: function () {
                return this._timeScale;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "playTimes", {
            /**
             * 播放次数 (0:循环播放， >0:播放次数)
             * @member {number} dragonBones.AnimationState#playTimes
             */
            get: function () {
                return this._playTimes;
            },
            enumerable: true,
            configurable: true
        });
        AnimationState._pool = [];
        return AnimationState;
    })();
    dragonBones.AnimationState = AnimationState;
})(dragonBones || (dragonBones = {})); 
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.Animation
     * @classdesc
     * Animation实例隶属于Armature,用于控制Armature的动画播放。
     * @see dragonBones.Bone
     * @see dragonBones.Armature
     * @see dragonBones.AnimationState
     * @see dragonBones.AnimationData.
     *
     * @example
       <pre>
       //获取动画数据
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");

        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));

        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[0].name;
        //从工厂里创建出Armature
        var armature:dragonBones.Armature = factory.buildArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        armatureDisplay.x = 200;
        armatureDisplay.y = 500;
        //把它添加到舞台上
        this.addChild(armatureDisplay);


        
        //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName:string = armature.animation.animationList[0];

        var animation:dragonBones.Animation = armature.animation;

        //gotoAndPlay的用法：动画播放，播放一遍
        animation.gotoAndPlay(curAnimationName,0,-1,1);

        //gotoAndStop的用法：
        //curAnimationName = armature.animation.animationList[1];
        //动画停在第二个动画的第0.2秒的位置
        //animation.gotoAndStop(curAnimationName,0.2);
        //动画停在第二个动画的一半的位置，如果第三个参数大于0，会忽略第二个参数
        //animation.gotoAndStop(curAnimationName,0, 0.5);
        //继续播放
        //animation.play();
        //暂停播放
        //animation.stop();

        //动画融合
        //animation.gotoAndPlay(curAnimationName,0,-1,0,0,"group1");

        //var animationState:dragonBones.AnimationState = armature.animation.getState(curAnimationName);
        //animationState.addBoneMask("neck",true);
        //播放第二个动画， 放到group "Squat"里
        //curAnimationName = armature.animation.animationList[1];
        //armature.animation.gotoAndPlay(curAnimationName,0,-1,0,0,"group2",dragonBones.Animation.SAME_GROUP);
        //animationState = armature.animation.getState(curAnimationName);
        //animationState.addBoneMask("hip",true);//“hip”是骨架的根骨骼的名字
        //animationState.removeBoneMask("neck",true);
        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
       </pre>
     */
    var Animation = (function () {
        /**
         * 创建一个新的Animation实例并赋给传入的Armature实例
         * @param armature {Armature} 骨架实例
         */
        function Animation(armature) {
            /** @private */
            this._animationStateCount = 0;
            this._armature = armature;
            this._animationList = [];
            this._animationStateList = [];
            this._timeScale = 1;
            this._isPlaying = false;
            this.tweenEnabled = true;
        }
        /**
         * 回收Animation实例用到的所有资源
         */
        Animation.prototype.dispose = function () {
            if (!this._armature) {
                return;
            }
            this._resetAnimationStateList();
            this._animationList.length = 0;
            this._armature = null;
            this._animationDataList = null;
            this._animationList = null;
            this._animationStateList = null;
        };
        Animation.prototype._resetAnimationStateList = function () {
            var i = this._animationStateList.length;
            var animationState;
            while (i--) {
                animationState = this._animationStateList[i];
                animationState._resetTimelineStateList();
                dragonBones.AnimationState._returnObject(animationState);
            }
            this._animationStateList.length = 0;
        };
        /**
         * 开始播放指定名称的动画。
         * 要播放的动画将经过指定时间的淡入过程，然后开始播放，同时之前播放的动画会经过相同时间的淡出过程。
         * @param animationName {string} 指定播放动画的名称.
         * @param fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
         * @param duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
         * @param playTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
         * @param layer {number} 动画所处的层
         * @param group {string} 动画所处的组
         * @param fadeOutMode {string} 动画淡出模式 (none, sameLayer, sameGroup, sameLayerAndGroup, all).默认值：sameLayerAndGroup
         * @param pauseFadeOut {boolean} 动画淡出时暂停播放
         * @param pauseFadeIn {boolean} 动画淡入时暂停播放
         * @returns {AnimationState} 动画播放状态实例
         * @see dragonBones.AnimationState.
         */
        Animation.prototype.gotoAndPlay = function (animationName, fadeInTime, duration, playTimes, layer, group, fadeOutMode, pauseFadeOut, pauseFadeIn) {
            if (fadeInTime === void 0) { fadeInTime = -1; }
            if (duration === void 0) { duration = -1; }
            if (playTimes === void 0) { playTimes = NaN; }
            if (layer === void 0) { layer = 0; }
            if (group === void 0) { group = null; }
            if (fadeOutMode === void 0) { fadeOutMode = Animation.SAME_LAYER_AND_GROUP; }
            if (pauseFadeOut === void 0) { pauseFadeOut = true; }
            if (pauseFadeIn === void 0) { pauseFadeIn = true; }
            if (!this._animationDataList) {
                return null;
            }
            var i = this._animationDataList.length;
            var animationData;
            while (i--) {
                if (this._animationDataList[i].name == animationName) {
                    animationData = this._animationDataList[i];
                    break;
                }
            }
            if (!animationData) {
                return null;
            }
            var needUpdate = this._isPlaying == false;
            this._isPlaying = true;
            this._isFading = true;
            //
            fadeInTime = fadeInTime < 0 ? (animationData.fadeTime < 0 ? 0.3 : animationData.fadeTime) : fadeInTime;
            var durationScale;
            if (duration < 0) {
                durationScale = animationData.scale < 0 ? 1 : animationData.scale;
            }
            else {
                durationScale = duration * 1000 / animationData.duration;
            }
            playTimes = isNaN(playTimes) ? animationData.playTimes : playTimes;
            //根据fadeOutMode,选择正确的animationState执行fadeOut
            var animationState;
            switch (fadeOutMode) {
                case Animation.NONE:
                    break;
                case Animation.SAME_LAYER:
                    i = this._animationStateList.length;
                    while (i--) {
                        animationState = this._animationStateList[i];
                        if (animationState.layer == layer) {
                            animationState.fadeOut(fadeInTime, pauseFadeOut);
                        }
                    }
                    break;
                case Animation.SAME_GROUP:
                    i = this._animationStateList.length;
                    while (i--) {
                        animationState = this._animationStateList[i];
                        if (animationState.group == group) {
                            animationState.fadeOut(fadeInTime, pauseFadeOut);
                        }
                    }
                    break;
                case Animation.ALL:
                    i = this._animationStateList.length;
                    while (i--) {
                        animationState = this._animationStateList[i];
                        animationState.fadeOut(fadeInTime, pauseFadeOut);
                    }
                    break;
                case Animation.SAME_LAYER_AND_GROUP:
                default:
                    i = this._animationStateList.length;
                    while (i--) {
                        animationState = this._animationStateList[i];
                        if (animationState.layer == layer && animationState.group == group) {
                            animationState.fadeOut(fadeInTime, pauseFadeOut);
                        }
                    }
                    break;
            }
            this._lastAnimationState = dragonBones.AnimationState._borrowObject();
            this._lastAnimationState._layer = layer;
            this._lastAnimationState._group = group;
            this._lastAnimationState.autoTween = this.tweenEnabled;
            this._lastAnimationState._fadeIn(this._armature, animationData, fadeInTime, 1 / durationScale, playTimes, pauseFadeIn);
            this.addState(this._lastAnimationState);
            //控制子骨架播放同名动画
            var slotList = this._armature.getSlots(false);
            i = slotList.length;
            while (i--) {
                var slot = slotList[i];
                if (slot.childArmature) {
                    slot.childArmature.animation.gotoAndPlay(animationName, fadeInTime);
                }
            }
            if (needUpdate) {
                this._armature.advanceTime(0);
            }
            return this._lastAnimationState;
        };
        /**
         * 播放指定名称的动画并停止于某个时间点
         * @param animationName {string} 指定播放的动画名称.
         * @param time {number} 动画停止的绝对时间
         * @param normalizedTime {number} 动画停止的相对动画总时间的系数，这个参数和time参数是互斥的（例如 0.2：动画停止总时间的20%位置） 默认值：-1 意味着使用绝对时间。
         * @param fadeInTime {number} 动画淡入时间 (>= 0), 默认值：0
         * @param duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
         * @param layer {string} 动画所处的层
         * @param group {string} 动画所处的组
         * @param fadeOutMode {string} 动画淡出模式 (none, sameLayer, sameGroup, sameLayerAndGroup, all).默认值：sameLayerAndGroup
         * @returns {AnimationState} 动画播放状态实例
         * @see dragonBones.AnimationState.
         */
        Animation.prototype.gotoAndStop = function (animationName, time, normalizedTime, fadeInTime, duration, layer, group, fadeOutMode) {
            if (normalizedTime === void 0) { normalizedTime = -1; }
            if (fadeInTime === void 0) { fadeInTime = 0; }
            if (duration === void 0) { duration = -1; }
            if (layer === void 0) { layer = 0; }
            if (group === void 0) { group = null; }
            if (fadeOutMode === void 0) { fadeOutMode = Animation.ALL; }
            var animationState = this.getState(animationName, layer);
            if (!animationState) {
                animationState = this.gotoAndPlay(animationName, fadeInTime, duration, NaN, layer, group, fadeOutMode);
            }
            if (normalizedTime >= 0) {
                animationState.setCurrentTime(animationState.totalTime * normalizedTime);
            }
            else {
                animationState.setCurrentTime(time);
            }
            animationState.stop();
            return animationState;
        };
        /**
         * 从当前位置继续播放动画
         */
        Animation.prototype.play = function () {
            if (!this._animationDataList || this._animationDataList.length == 0) {
                return;
            }
            if (!this._lastAnimationState) {
                this.gotoAndPlay(this._animationDataList[0].name);
            }
            else if (!this._isPlaying) {
                this._isPlaying = true;
            }
            else {
                this.gotoAndPlay(this._lastAnimationState.name);
            }
        };
        /**
         * 暂停动画播放
         */
        Animation.prototype.stop = function () {
            this._isPlaying = false;
        };
        /**
         * 获得指定名称的 AnimationState 实例.
         * @returns {AnimationState} AnimationState 实例.
         * @see dragonBones..AnimationState.
         */
        Animation.prototype.getState = function (name, layer) {
            if (layer === void 0) { layer = 0; }
            var i = this._animationStateList.length;
            while (i--) {
                var animationState = this._animationStateList[i];
                if (animationState.name == name && animationState.layer == layer) {
                    return animationState;
                }
            }
            return null;
        };
        /**
         * 检查是否包含指定名称的动画.
         * @returns {boolean}.
         */
        Animation.prototype.hasAnimation = function (animationName) {
            var i = this._animationDataList.length;
            while (i--) {
                if (this._animationDataList[i].name == animationName) {
                    return true;
                }
            }
            return false;
        };
        /** @private */
        Animation.prototype._advanceTime = function (passedTime) {
            if (!this._isPlaying) {
                return;
            }
            var isFading = false;
            passedTime *= this._timeScale;
            var i = this._animationStateList.length;
            while (i--) {
                var animationState = this._animationStateList[i];
                if (animationState._advanceTime(passedTime)) {
                    this.removeState(animationState);
                }
                else if (animationState.fadeState != 1) {
                    isFading = true;
                }
            }
            this._isFading = isFading;
        };
        /** @private */
        //当动画播放过程中Bonelist改变时触发
        Animation.prototype._updateAnimationStates = function () {
            var i = this._animationStateList.length;
            while (i--) {
                this._animationStateList[i]._updateTimelineStates();
            }
        };
        Animation.prototype.addState = function (animationState) {
            if (this._animationStateList.indexOf(animationState) < 0) {
                this._animationStateList.unshift(animationState);
                this._animationStateCount = this._animationStateList.length;
            }
        };
        Animation.prototype.removeState = function (animationState) {
            var index = this._animationStateList.indexOf(animationState);
            if (index >= 0) {
                this._animationStateList.splice(index, 1);
                dragonBones.AnimationState._returnObject(animationState);
                if (this._lastAnimationState == animationState) {
                    if (this._animationStateList.length > 0) {
                        this._lastAnimationState = this._animationStateList[0];
                    }
                    else {
                        this._lastAnimationState = null;
                    }
                }
                this._animationStateCount = this._animationStateList.length;
            }
        };
        Object.defineProperty(Animation.prototype, "movementList", {
            /**
            * 不推荐的API.推荐使用 animationList.
            */
            get: function () {
                return this._animationList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "movementID", {
            /**
            * 不推荐的API.推荐使用 lastAnimationName.
            */
            get: function () {
                return this.lastAnimationName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "lastAnimationState", {
            /**
             * 最近播放的 AnimationState 实例。
             * @member {AnimationState} dragonBones.Animation#lastAnimationState
             * @see dragonBones.AnimationState
             */
            get: function () {
                return this._lastAnimationState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "lastAnimationName", {
            /**
             * 最近播放的动画名称.
             * @member {string} dragonBones.Animation#lastAnimationName
             */
            get: function () {
                return this._lastAnimationState ? this._lastAnimationState.name : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "animationList", {
            /**
             * 所有动画名称列表.
             * @member {string[]} dragonBones.Animation#animationList
             */
            get: function () {
                return this._animationList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "isPlaying", {
            /**
             * 是否正在播放
             * @member {boolean} dragonBones.Animation#isPlaying
             */
            get: function () {
                return this._isPlaying && !this.isComplete;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "isComplete", {
            /**
             * 最近播放的动画是否播放完成.
             * @member {boolean} dragonBones.Animation#isComplete
             */
            get: function () {
                if (this._lastAnimationState) {
                    if (!this._lastAnimationState.isComplete) {
                        return false;
                    }
                    var i = this._animationStateList.length;
                    while (i--) {
                        if (!this._animationStateList[i].isComplete) {
                            return false;
                        }
                    }
                    return true;
                }
                return true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "timeScale", {
            /**
             * 时间缩放倍数
             * @member {number} dragonBones.Animation#timeScale
             */
            get: function () {
                return this._timeScale;
            },
            set: function (value) {
                if (isNaN(value) || value < 0) {
                    value = 1;
                }
                this._timeScale = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "animationDataList", {
            /**
             * 包含的所有动画数据列表
             * @member {AnimationData[]} dragonBones.Animation#animationDataList
             * @see dragonBones.AnimationData.
             */
            get: function () {
                return this._animationDataList;
            },
            set: function (value) {
                this._animationDataList = value;
                this._animationList.length = 0;
                for (var i = 0, len = this._animationDataList.length; i < len; i++) {
                    var animationData = this._animationDataList[i];
                    this._animationList[this._animationList.length] = animationData.name;
                }
            },
            enumerable: true,
            configurable: true
        });
        Animation.NONE = "none";
        Animation.SAME_LAYER = "sameLayer";
        Animation.SAME_GROUP = "sameGroup";
        Animation.SAME_LAYER_AND_GROUP = "sameLayerAndGroup";
        Animation.ALL = "all";
        return Animation;
    })();
    dragonBones.Animation = Animation;
})(dragonBones || (dragonBones = {})); 
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.DragonBones
     * @classdesc
     * DragonBones
     */
    var DragonBones = (function () {
        function DragonBones() {
        }
        /**
         * DragonBones当前数据格式版本
         */
        DragonBones.DATA_VERSION = "4.0";
        /**
         *
         */
        DragonBones.PARENT_COORDINATE_DATA_VERSION = "3.0";
        DragonBones.VERSION = "4.1.5";
        return DragonBones;
    })();
    dragonBones.DragonBones = DragonBones;
})(dragonBones || (dragonBones = {}));
