from WRO_FINAL_2026_LIB import *
import WRO_FINAL_2026_LIB as lib


# 옐로우 타워 픽업
async def yellow_tower_pickup():
    await MoveStraight(283, 80)
    await TurnGyro_Control(-90, 90)
    await LineFollow_Deg_Control(90, 190)
    await LineFollow_blk_Control(50)
    await MoveStraight(16, 90)
    await TurnGyro_Control(90, 90)
    await MoveStraight(30, -80)

    await multitask(
        RightArmMove360(0, 800),
        LeftArmMove360(0, 800)
    )

    await MoveStraight(130, 80)

    await multitask(
        RightArmMove360(190, 200),
        LeftArmMove360(170, 200)
    )

    await MoveStraight(580, -90)
    await wait(100)


# 블루 & 블랙 관객 픽업
async def blue_black_audience_pickup():
    await TurnGyro_Control(90, 90)
    await wait(100)
    await MoveStraight(205, 100)
    await TurnGyro_OneWheel_Control(90, 'L', 90)
    await MoveStraight(130, 50)
    await MoveStraight(30, 42)

    await multitask(
        RightArmMove360(270, 250),
        LeftArmMove360(90, 250)
    )

    await wait(100)
    await MoveStraight(123, -100)
    await wait(100)


# 유물 스캔
async def artifact_scan():
    await TurnGyro_Control(-90, 90)
    await wait(300)

    await multitask(
        MoveStraight(270, 90)
        # LeftArmMove360(130, 150)
    )

    await wait(100)
    await Scan(84, 1256)


# 옐로우 탑1 드롭
async def yellow_tower_1_drop():
    await wait(100)
    await TurnGyro_Control(23, 70)
    await wait(100)
    # await MoveStraight(10, 90)
    await wait(100)
    await LeftArmMove360(45, 180)
    await wait(150)
    await MoveStraight(77, -90)
    await wait(150)
    await TurnGyro_Control(-98, 90)
    await wait(200)


# 옐로우 탑2 드롭
async def yellow_tower_2_drop():
    await multitask(
        MoveStraight(510, 90),
        RightArmMove360(250, 150)
    )

    await wait(100)
    await RightArmMove360(320, 150)
    await wait(100)
    await MoveStraight(220, -90)
    await MoveStraight_blk_Control(-40)
    await MoveStraight(15, 80)
    await TurnGyro_Control(81, 80)


# 먼지 & 관객 드롭
async def dust_audience_drop():
    await LineFollow_Deg_Control(80, 250)
    await LineFollow_color_Control(40)
    await TurnGyro_Curve_Control( 85, base_pwr=80, max_turn=30, min_turn=17)
    await MoveStraight(27,-100)
    await TurnGyro_Control(-45,90)
    await multitask(
        RightArmMove360(200,800),
        MoveStraight(10,100)
        # LeftArmMove360(270,-150)
    )
    await MoveStraight(30,-100)
    await TurnGyro_OneWheel_Control(45,"R",80)
    await MoveStraight(400,-100)
    await MoveStraight(80,100)
    await TurnGyro_Control(-137,80)
    await LeftArmMove360(180,500)
    await MoveStraight(200,-80)
    await TurnGyro_Control(-151,80)
    await MoveStraight(300,100)
    await MoveStraight_blk_Control(100)
    await wait(300)
    await MoveStraight(16,-80)
    await TurnGyro_Control(-73,80)
    await MoveStraight(20,-80)


    # await LineFollow_Deg_Control(80, 250)
    # await LineFollow_color_Control(40)
    # await TurnGyro_Control(-20, 90)
    # await MoveStraight(210, 100)
    # await TurnGyro_OneWheel_Control(-60, 'R', 80)
    # await TurnGyro_OneWheel_Control(20, 'R', 80)
    # await MoveStraight(40, 100)
    # await LeftArmMove360(180, 500)
    # await TurnGyro_OneWheel_Control(20,'L',80)
    # await MoveStraight(360, -100)
    # await MoveStraight(100,100)
    # await TurnGyro_Control(-179, 90)
    # await MoveStraight(160,80)
    # await RightArmMove360(200, 800)
    # await MoveStraight(250, -100)

    # await LineFollow_Deg_Control(80, 250)
    # await LineFollow_color_Control(40)
    # await TurnGyro_Control(-30, 90)
    # await MoveStraight(230, 100)
    # await TurnGyro_OneWheel_Control(-33, 'R', 80)
    # await MoveStraight(30, 100)
    # await LeftArmMove360(180, 500)
    # await MoveStraight(30, -100)
    # await TurnGyro_OneWheel_Control(-14, 'L', 80)
    # await wait(100)
    # await MoveStraight(330, -100)
    # await wait(100)
    # await multitask(
    #     MoveStraight(90,80),
    #     RightArmMove360(300, 800)
    # )
    # await TurnGyro_Control(-207, 86)
    # await MoveStraight(80,100)
    # await RightArmMove360(200, 800)
    # await MoveStraight(250, -100)

    # await TurnGyro_Control(91, 90)
    # await MoveStraight(400, 100)
    # await MoveStraight_blk_Control(100)
    # await wait(300)
    # await MoveStraight(20,-80)
    # await TurnGyro_Control(-70, 90)

    # await LineFollow_Deg_Control(80, 250)
    # await LineFollow_color_Control(40)
    # await TurnGyro_Control(-30, 90)
    # await MoveStraight(230, 100)
    # await TurnGyro_OneWheel_Control(-40, 'R', 80)
    # await MoveStraight(30, 100)
    # await LeftArmMove360(180, 500)
    # await MoveStraight(30, -100)
    # await TurnGyro_OneWheel_Control(-11, 'L', 80)
    # await wait(100)
    # await MoveStraight(330, -100)
    # await wait(100)
    # await multitask(
    #     MoveStraight(20,80),
    #     RightArmMove360(244,-100)
    # )
    # await TurnGyro_Control(-207, 90)
    # await MoveStraight(20,100)
    # await RightArmMove360(200, 800)
    # await MoveStraight(250, -100)

    # await TurnGyro_Control(90, 90)
    # await MoveStraight(330, 100)
    # await MoveStraight_blk_Control(100)
    # await MoveStraight(20,-80)
    # await TurnGyro_Control(-70, 90)

# 먼지 & 관객 드롭 및 서프라이즈 미션
async def dust_audience_drop_surprise_mssion_ver1():
    # await TurnGyro_Curve_Control( 90, base_pwr=80, max_turn=30, min_turn=17)
    # await MoveStraight(27,-100)
    # await TurnGyro_Control(-45,90)
    # await multitask(
    #     RightArmMove360(200,800),
    #     MoveStraight(20,100)
    #     # LeftArmMove360(270,-150)
    # )
    # await MoveStraight(30,-100)
    # await TurnGyro_OneWheel_Control(45,"R",80)
    # await MoveStraight(400,-100)
    # await MoveStraight(80,100)
    # await TurnGyro_Control(-150,-80)
    # await LeftArmMove360(180,500)
    # await MoveStraight(200,-80)
    # await TurnGyro_Control(-140,80)
    # await MoveStraight(300,100)
    # await MoveStraight_blk_Control(100)
    # await TurnGyro_Control(-40,80)
    # await MoveStraight(400,100)


    # await LineFollow_Deg_Control(80, 250)
    # await LineFollow_color_Control(40)
    # await TurnGyro_Control(-20, 90)
    # await MoveStraight(210, 100)
    # await TurnGyro_OneWheel_Control(-60, 'R', 80)
    # await TurnGyro_OneWheel_Control(20, 'R', 80)
    # await MoveStraight(40, 100)
    # await LeftArmMove360(180, 500)
    # await TurnGyro_OneWheel_Control(20,'L',80)
    # await MoveStraight(360, -100)
    # await MoveStraight(100,100)
    # await TurnGyro_Control(-179, 90)
    # await MoveStraight(160,80)
    # await RightArmMove360(200, 800)
    # await MoveStraight(250, -100)
    await LineFollow_Deg_Control(80, 250)
    await LineFollow_color_Control(40)

#####서프라이즈 미션 준비 ver1######################
    await multitask(                             #
        RightArmMove360(190, 200),               #
        LeftArmMove360(170, 200)                 #
    )                                            #
    await MoveStraight(170,-80)                  #
    await TurnGyro_Control(25,90)                #
    await MoveStraight(195,100)                  #
    await LeftArmMove360(90, 250)                #
    await MoveStraight(160,-80)                  #
    await TurnGyro_Control(-56,90)               #
    await MoveStraight(210,80)                   #
    await RightArmMove360(270, 250)              #
    await MoveStraight_blk_Control(-80)          #
    await MoveStraight(20,80)                    #
    await TurnGyro_Control(34,90)                #
    await LineFollow_Deg_Control(70,250)         #
    await LineFollow_color_Control(40)           #
##################################################

    await TurnGyro_Control(-30, 90)
    await MoveStraight(230, 100)
    await TurnGyro_OneWheel_Control(-40, 'R', 80)
    await MoveStraight(40, 100)
    await LeftArmMove360(180, 500)
    await MoveStraight(30, -100)
    await TurnGyro_OneWheel_Control(-10, 'L', 80)
    await wait(100)
    await MoveStraight(330, -100)
    await wait(100)
    await MoveStraight(100,80)
    await TurnGyro_Control(153, 90)
    await MoveStraight(120,100)
    await RightArmMove360(200, 800)
    await MoveStraight(250, -100)

    await TurnGyro_Control(90, 90)
    await MoveStraight(400, 100)
    await MoveStraight_blk_Control(70)
    await wait(300)
    await MoveStraight(16,-80)
    await TurnGyro_Control(-70, 90)

async def relics_pick_up():
    await run_pickup_mission()
    # White_zone : [
    #     lib.DROP_ZONE[Color]
    #     for slots, Color in lib.colors_ref.items()
    #     if White_zone != lib.slots[slots-1]
    # ]
    # print(White_zone)
    await MoveStraight(380,-80)
    await multitask(
        TurnGyro_Control(-90,80)
    )
    final_zone = lib.get_last_zone()
    print("[MAIN] 마지막 Zone:", final_zone)

    if final_zone == (0, 1):
        print("Zone01 후속 동작")
        await MoveStraight(800,90)

    elif final_zone == (1, 2):
        print("Zone12 후속 동작")
        await MoveStraight(900,90)

    elif final_zone == (2, 3):
        print("Zone23 후속 동작")
        await MoveStraight(1200,90)

    elif final_zone == (3, 4):
        print("Zone34 후속 동작")
        await MoveStraight(1300,90)

    elif final_zone == (4, 5):
        print("Zone45 후속 동작")
        await MoveStraight(1400,90)

    elif final_zone == (5, 6):
        print("Zone56 후속 동작")
        await MoveStraight(1500,90)
    
    await MoveStraight(100,50)


# 레드 & 그린 관객 픽업
async def red_green_audience_pickup():
    # await MoveStraight(240, -100)
    await multitask(
        MoveStraight(240, -100),
        RightArmMove360(190, 200),
        LeftArmMove360(170, 200)
    )
    await TurnGyro_Control(-90, 90)
    await MoveStraight_blk_Control(90)
    await MoveStraight(50, 50)

    await multitask(
        RightArmMove360(280, 650),
        LeftArmMove360(80, 650)
    )

    await MoveStraight(640, -90)
    await MoveStraight_blk_Control(-60)
    await wait(100)
    await MoveStraight(60, 60)


# 레드 탑 픽업
async def red_tower_pickup():
    await TurnGyro_Control(-90, 90)
    await MoveStraight(180, -90)
    await MoveStraight(230, -50)

    await multitask(
        RightArmMove360(210, 650),
        LeftArmMove360(160, 650)
    )
    await MoveStraight(630,90)
    await TurnGyro_OneWheel_Control(-88, 'R', 90)
    await MoveStraight(20, 90)
    await wait(150)

# 레드 탑 픽업 및 서프라이즈 미션
async def red_tower_pickup_surprise_mission_ver2():
    await TurnGyro_Control(-90, 90)
    await MoveStraight(180, -90)
    await MoveStraight(230, -50)

    await multitask(
        RightArmMove360(210, 650),
        LeftArmMove360(160, 650)
    )
####서프라이즈 미션 준비 ver2#####################
    await MoveStraight(430,90)                 #
    await TurnGyro_OneWheel_Control(-90,"R",80)#
    await MoveStraight(50,80)                  #
    await multitask(                           #
        RightArmMove360(280, 650),             #
        LeftArmMove360(80, 650)                #
    )                                          #
    await MoveStraight(50,-80)                 #
    await TurnGyro_OneWheel_Control(88,"R",80) #
    await multitask(                           #
        RightArmMove360(210, 650),             #
        LeftArmMove360(160, 650)               #
    )                                          #
    await MoveStraight(200, 90)                #
################################################

    await TurnGyro_OneWheel_Control(-88, 'R', 90)
    await MoveStraight(20, 90)
    await wait(150)

# 레드 관객 드롭
async def red_audience_drop():
    await LeftArmMove360(90, 800)
    await MoveStraight(700, -80)
    await MoveStraight(140, -50)
    await LeftArmMove360(160, 850)


# 그린 관객 드롭
async def green_audience_drop():
    await wait(100)
    await MoveStraight(20, 100)
    await TurnGyro_OneWheel_Control(179, "L", 90)
    await MoveStraight(90, 70)
    await wait(100)


# 레드 탑1 드롭
async def red_tower_1_drop():
    await MoveStraight(145, -90)
    await wait(100)
    await TurnGyro_OneWheel_Control(90, 'R', 90)
    await wait(100)
    await MoveStraight(420, -90)
    await RightArmMove360(0, 600)
    await MoveStraight(230, 90)
    await wait(100)

# 레드 탑2 드롭
async def red_tower_2_drop():
    await TurnGyro_Control(-60, 90)
    await LeftArmMove360(0, 600)
    await wait(100)
    await MoveStraight(390, -90)
    await MoveStraight(50, 90)

# 레드 탑1 드롭 정확도
async def red_tower_1_drop_ver2():
    await MoveStraight(150, -90)
    await TurnGyro_Control(-115,90)
    await MoveStraight(400,100)
    await MoveStraight_blk_Control(100)
    await MoveStraight(10,-80)
    await TurnGyro_Control(23,90)
    await wait(100)
    await LineFollow_Deg_Control(77,350,1,3)
    await LineFollow_color_Control(50)
    await wait(100)
    await MoveStraight(290,-80)
    await TurnGyro_Control(-90,90)
    await RightArmMove360(0, 600)
    await MoveStraight(30,-100)

# 레드 탑2 드롭 정확도
async def red_tower_2_drop_ver2():
    await MoveStraight(180,80)
    await multitask(
        RightArmMove360(210, 650),
        MoveStraight(107,80)
    )
    await TurnGyro_Control(-90,90)
    await MoveStraight(62,100)
    await LeftArmMove360(0, 600)

# 전체 미션 실행
async def main():
    voltage = hub.battery.voltage()
    print("배터리 전압:", voltage, "mV")

    await yellow_tower_pickup()          # 옐로우 타워 픽업
    await blue_black_audience_pickup()   # 블루 & 블랙 관객 픽업
    await artifact_scan()                # 유물 스캔
    await yellow_tower_1_drop()          # 옐로우 탑1 드롭
    await yellow_tower_2_drop()          # 옐로우 탑2 드롭
    await dust_audience_drop()           # 먼지 & 관객 드롭
    # await dust_audience_drop_surprise_mssion_ver1() # 먼지 & 관객 드롭 및 서프라이즈 미션
    await relics_pick_up()               # 유물 픽업 & 유물 드롭    
    await red_green_audience_pickup()    # 레드 & 그린 관객 픽업
    await red_tower_pickup()             # 레드 탑 픽업
    # await red_tower_pickup_surprise_mission_ver2() # 레드 탑 픽업 및 서프라이즈 미션
    await red_audience_drop()            # 레드 관객 드롭
    await green_audience_drop()          # 그린 관객 드롭
    # await red_tower_1_drop()             # 레드 탑1 드롭
    # await red_tower_2_drop()             # 레드 탑2 드롭
    await red_tower_1_drop_ver2()        # 레드 탑1 드롭 ver2
    await red_tower_2_drop_ver2()        # 레드 탑1 드롭 ver2


run_task(main())