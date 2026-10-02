from WRO_FINAL_2026_LIB import *
import WRO_FINAL_2026_LIB as lib

async def audience_pick_up_3():
    await MoveStraight(283, 80)
    await TurnGyro_Control(-90, 90)
    await LineFollow_Deg_Control(90, 190)
    await LineFollow_blk_Control(50)
    await TurnGyro_Control(-5,90)
    await multitask(
        MoveStraight(300,-80),
        RightArmMove360(0, 650),
        LeftArmMove360(0, 650)
        
    )
    await multitask(
        RightArmMove360(210, -650),
        LeftArmMove360(160, -650)
    )
    await MoveStraight(600,80)
    await MoveStraight(80,-80)
    await TurnGyro_Control(-90,80)
    await MoveStraight(600,80)
    await RightArmMove360(270, 250)
    await MoveStraight(170,80)
    await MoveStraight(40,-80)
    await TurnGyro_Control(-90,80)
    await multitask(
        MoveStraight(1000,80),
        RightArmMove360(210, -650)
    )
    await MoveStraight(140,-80)
    await TurnGyro_Control(-90,90)
    await LeftArmMove360(0, 650)
    await MoveStraight(20,-80)
    await multitask(
        MoveStraight(300,80),
        RightArmMove360(210, -650),
        LeftArmMove360(160, -650)
    )
    await TurnGyro_Control(90,80)
    await MoveStraight_blk_Control(80)
    await TurnGyro_Control(90,80)
    await LineFollow_Deg_Control(200,80,-1)
    await LineFollow_color_Control(30,-1,True,Color.GREEN)
    await MoveStraight(700,-80)
    await TurnGyro_Control(-90,80)
    await MoveStraight(200,80)
    await TurnGyro_OneWheel_Control(90,"L",80)
    await LeftArmMove360(0,800)
    await MoveStraight(600,100)
    await multitask(
        RightArmMove360(210, -650),
        LeftArmMove360(160, -650)
    )
    await MoveStraight(80,-80)
    await TurnGyro_OneWheel_Control(90,"L",80)
    await TurnGyro_OneWheel_Control(-90,"L",80)
    await MoveStraight(100,-80)
    await MoveStraight_blk_Control(-100)
    await wait (100)
    await MoveStraight(80,80)
    await TurnGyro_Control(-90,80)
    await LineFollow_Deg_Control(80, 250)
    await LineFollow_color_Control(40)
    # await MoveStraight(300,80)
    # await TurnGyro_Control(90,80)
    # await MoveStraight(240,80)
    # await MoveStraight(80,-80)
    # await TurnGyro_Control(-120,80)
    # await multitask(
    #     MoveStraight(200,100),
    #     RightArmMove360(270, 250),
    #     LeftArmMove360(90, 250)

    # )
    await wait(100)
    await MoveStraight(12,-80)
    await TurnGyro_Control(90,80)
    await RightArmMove360(0, 650)
    await MoveStraight(200,60)
    await RightArmMove360(190, 200)
    await MoveStraight(100,-80)
    await TurnGyro_Control(-90,80)
    await MoveStraight(240,80)
    await TurnGyro_Control(90,80)
    await MoveStraight(230,80)
    await TurnGyro_Control(4,80)
    await multitask(
        RightArmMove360(270, 250),
        LeftArmMove360(90, 250)

    )
    await MoveStraight(200,-80)
    await MoveStraight(400,-80)
    await multitask(
        RightArmMove360(210, -650),
        LeftArmMove360(160, -650)
    )
    await MoveStraight(200,-80)
    await TurnGyro_Control(90,80)
    await LeftArmMove360(0,600)
    await MoveStraight(200,60)
    await LeftArmMove360(90, 250)
    await MoveStraight(80,-80)#yfr
    await LeftArmMove360(160, -650)
    await TurnGyro_Control(-14,80)
    await MoveStraight(770,80)
    await MoveStraight_blk_Control(100)
    await TurnGyro_Control(20,80)
    await LineFollow_Deg_Control(500,80)
    await LineFollow_color_Control(50)
    await MoveStraight(55,100)
    await TurnGyro_OneWheel_Control(90,'L',80)
    await MoveStraight(10,80)
    await LineFollow_Deg_Control(80,180,-1)#kfc_robotics
    await LineFollow_blk_Control(50,-1)
    await MoveStraight(30,70)
    await TurnGyro_Control(-90, 90)
    await LineFollow_Deg_Control(70,200,1)
    await LineFollow_blk_Control(80,1)
    await MoveStraight(16, 90)
    await TurnGyro_Control(90, 90)
    await MoveStraight(30,80)
    await multitask(
        RightArmMove360(320, 150),
        LeftArmMove360(45, 180)
    )
    await MoveStraight(200,-80)
    await TurnGyro_Control(-90,80)
    await MoveStraight(1000,-50)




async def main():
    voltage = hub.battery.voltage()
    print("배터리 전압:", voltage, "mV")

    await audience_pick_up_3()


run_task(main())