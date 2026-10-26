# 卡通学生转换

student-cartoon.glb：HairSample_Male.vrm（VRoid Project，CC0）。

guide-cartoon.glb：AvatarSample_D.vrm（旧版β Ver AvatarSample_1，VRoid Project，CC0）。

使用Three.js r183.2原GLTFLoader和GLTFExporter，以及pixiv three-vrm-core 3.4.4原VRMHumanoid转换。保留原角色网格及服装；贴图最长边1024；Idle/Walk来自Rocketbox MIT动作库，按VRM官方标准化骨骼及VRM0坐标方向转换，使用同源Male_Adult_09的绑定骨架（非迈步首帧），校正绑定A姿态，按真实蒙皮顶点烘焙垂直贴地高度，动作内置到GLB。运行时无需Blender、完整VRM运行库或导出器。详情见VRoid-LICENSE.md与模型与组件来源.md。
