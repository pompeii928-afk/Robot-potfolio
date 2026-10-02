# INDIA_LIB_0918_PAIR: 최신 첨부본 기반 Pair 직접 거리 이동. 조정 위치는 동봉 README.md 참조.
# INDIA_LIB_0911_03: REF-V1.10 전진/제자리 회전 통합본. 적용 범위는 README.md 참조.
from math import pi
# =============================================================================
# WRO INDIA LIB 03 - Front-only staged pickup
# 기준: WRO_INDIA_LIB_02
# 주요 변경 사항:
#   - 모든 픽업/이동/드롭을 로봇 전면 자세 기준으로 실행
#   - front/rear 상태값은 물리 방향이 아니라 1차/2차 적재 공간으로만 사용
#   - 1차 픽업은 양팔 290도, 2차 단일 픽업은 해당 팔 200도
#   - 두 적재 묶음을 모두 픽업한 뒤 1차/2차 드롭 순서로 실행
#   - 논리 R/L과 실제 R/L을 항상 동일하게 유지
# 유지 사항: planner의 Pair/Zone 판단, 색상 복구, 안전 검증 로직
# 추가: 기존 안전 경로 유지 -> 대체 역순 계획 탐색 -> 필요한 미션만 정순 드롭
# 주의: 거리, 회전, 속도 및 팔 각도는 실물 로봇에서 최종 보정해야 합니다.
# =============================================================================

from pybricks.hubs import PrimeHub
from pybricks.pupdevices import Motor, ColorSensor
from pybricks.parameters import Port, Direction, Color
from pybricks.tools import wait, run_task, StopWatch, multitask
from pybricks.iodevices import PUPDevice

# 1. 기본 설정
hub = PrimeHub()
motorL = Motor(Port.D, Direction.COUNTERCLOCKWISE)
motorR = Motor(Port.C)
L_arm = Motor(Port.F,Direction.COUNTERCLOCKWISE )
R_arm = Motor(Port.E) 
sensor = ColorSensor(Port.B)
s2 = ColorSensor(Port.A)
s2raw = PUPDevice(Port.A)
WheelD = 62

MaxAcc = 3000
MaxSpeed = 100
MinSpeed = 30
LeftMotorPW = 0
RightMotorPW = 0
MAX_U = 45 #기존 20에서 변경
tLoop = 10
Axle = 170

GKp = 5.5
GKd = 7.0
DistanceKp = 3

kP_line = 1.0
kD_line = 7.0

# ========================
# 전역 변수 (Scan에서 채워짐)
# ========================
UNKNOWN_COLOR = -1                  # 유물은 있으나 색상을 확정하지 못한 물리 슬롯
VALID_ARTIFACT_COLORS = (5, 3, 1, 2, 4)  # 드롭존 1~5 순서: RED/GREEN/BLACK/BLUE/YELLOW

# 정상 스캔 로그에서 실측한 각 물리 슬롯의 중심 위치(dBaseENC 도 단위).
# 354 -> 606 -> 860 -> 1114 (간격 252, 254, 254도)
# 로봇/센서 위치가 바뀌면 이 네 값만 다시 측정해 조정한다.
SCAN_SLOT_CENTERS_DEG = (354, 606, 860, 1114)
SCAN_SLOT_SPACING_DEG = 254
SCAN_FIRST_SAVE_DEG = 250

slots = [UNKNOWN_COLOR, UNKNOWN_COLOR, UNKNOWN_COLOR, UNKNOWN_COLOR]
blockLocation = [0, 0, 0, 0, 0, 0, 0]  # 색상별 위치(mm) – 인덱스 1~6 사용
scanCompleted = False                 # Scan()이 오류 없이 끝났는지 구분

# ========================
# 드롭존 매핑 (색상 ID → 드롭존 번호)
# RED(5)→1, GREEN(3)→2, BLACK(1)→3, BLUE(2)→4, YELLOW(4)→5
# ========================
DROP_ZONE = {
    5: 1,   # 빨강
    3: 2,   # 초록
    1: 3,   # 검정
    2: 4,   # 파랑
    4: 5    # 노랑
}

def DegToMM(deg):
    """모터 회전각(도)을 바퀴가 굴러간 거리(mm)로 환산한다.
    매개변수: deg - 모터 회전각(도)
    반환값: 이동 거리(mm)"""
    return deg / 360 * 3.14159 * WheelD

def ThetaErr(angle):
    """목표 방향(angle)과 현재 자이로 방향의 차이(오차)를 -180~180도 범위로 계산한다.
    매개변수: angle - 목표 방향(도, 0=처음 방향 기준)
    반환값: 오차(도). 양수면 목표가 오른쪽, 음수면 왼쪽에 있음"""
    compass = (((hub.imu.heading() - angle) % 360) + 360) % 360
    zeta = compass if compass <= 180 else compass - 360
    return zeta

def dBaseENC():
    """왼쪽·오른쪽 바퀴 모터 각도의 평균을 반환한다 (로봇이 얼마나 이동했는지 재는 기준값).
    반환값: 두 바퀴 모터 각도의 평균(도)"""
    return (motorL.angle() + motorR.angle()) / 2

async def LeftControl(speed, err):
    """왼쪽 바퀴 모터를 목표 속도(speed)로 부드럽게 가속/감속시키고, 방향 보정값(err)을 더해 출력한다.
    매개변수: speed - 목표 속도(-100~100), err - 방향 보정값(자이로 오차 기반)"""
    global _heading_ready
    _heading_ready = False
    global MaxAcc, tLoop, MinSpeed, MaxSpeed, LeftMotorPW

    current_power = LeftMotorPW
    power_change = speed - current_power
    max_change = MaxAcc * (tLoop / 1000)

    if abs(power_change) > max_change:
        if power_change > 0:
            drive_power = current_power + max_change
        else:
            drive_power = current_power - max_change
    else:
        drive_power = speed

    if abs(drive_power) < MinSpeed and drive_power != 0:
        drive_power = MinSpeed if drive_power > 0 else -MinSpeed
    if drive_power > MaxSpeed:
        drive_power = MaxSpeed
    elif drive_power < -MaxSpeed:
        drive_power = -MaxSpeed

    final_power = drive_power + err
    if final_power > 100:
        final_power = 100
    elif final_power < -100:
        final_power = -100

    motorL.dc(final_power)
    LeftMotorPW = drive_power

async def RightControl(speed, err):
    """오른쪽 바퀴 모터를 목표 속도(speed)로 부드럽게 가속/감속시키고, 방향 보정값(err)을 더해 출력한다.
    매개변수: speed - 목표 속도(-100~100), err - 방향 보정값(자이로 오차 기반)"""
    global _heading_ready
    _heading_ready = False
    global MaxAcc, tLoop, MinSpeed, MaxSpeed, RightMotorPW

    current_power = RightMotorPW
    power_change = speed - current_power
    max_change = MaxAcc * (tLoop / 1000)

    if abs(power_change) > max_change:
        if power_change > 0:
            drive_power = current_power + max_change
        else:
            drive_power = current_power - max_change
    else:
        drive_power = speed

    if abs(drive_power) < MinSpeed and drive_power != 0:
        drive_power = MinSpeed if drive_power > 0 else -MinSpeed
    if drive_power > MaxSpeed:
        drive_power = MaxSpeed
    elif drive_power < -MaxSpeed:
        drive_power = -MaxSpeed

    final_power = drive_power + err
    if final_power > 100:
        final_power = 100
    elif final_power < -100:
        final_power = -100

    motorR.dc(final_power)
    RightMotorPW = drive_power


def Angle360(motor):
    """모터의 누적 회전각(raw)을 0~359 범위로 변환한다.
    매개변수: motor - 대상 모터(L_arm 또는 R_arm)
    반환값: 0~359 사이의 각도"""
    return motor.angle() % 360


async def ArmMoveToAngle360(
    motor, target_angle, speed=200, tolerance=5, stall_timeout=300,
    min_progress_deg=3, start_tolerance=15, recovery_tolerance=3
):
    """각 팔의 실제 허용 범위 안에서 목표까지 이동한다.

    오른팔: 180~360도(0=360), 왼팔: 0~180도(360=0).
    왼팔 COUNTERCLOCKWISE 누적각은 부호를 반전해 위의 실제 각도로 해석한다.
    speed는 빠르기만 사용하며 방향은 현재/목표 각도로 결정한다.
    목표 방향으로 3도 진행할 때마다 정체 타이머를 초기화한다.
    목표 도달 시 True, 500ms 정체 시 False를 반환하고 hold한다.
    시작 위치는 끝점 밖 15도까지 안쪽으로 복귀할 수 있다(목표 허용 범위는 그대로).
    복귀하면서 이동 허용 구간을 줄이며, 측정값 흔들림에는 3도 여유를 둔다.
    시작 허용치를 넘는 현재 각도/잘못된 목표는 ValueError로 차단한다.
    """
    if motor is R_arm:
        lower, upper = 180, 360
        arm_name = 'R'
        angle_sign = 1
    elif motor is L_arm:
        lower, upper = 0, 180
        arm_name = 'L'
        angle_sign = -1
    else:
        raise ValueError('Arm motor must be R_arm or L_arm')

    if not (0 <= target_angle <= 360):
        motor.hold()
        raise ValueError(arm_name + ' arm target must be between 0 and 360')
    if arm_name == 'R' and target_angle == 0:
        target_angle = 360
    elif arm_name == 'L' and target_angle == 360:
        target_angle = 0
    if not (lower <= target_angle <= upper):
        motor.hold()
        raise ValueError(arm_name + ' arm target outside mechanical range: ' + str(target_angle))
    if not (speed != 0 and 0 <= tolerance <= 5
            and stall_timeout > 0 and min_progress_deg > 0
            and tolerance <= start_tolerance < 90
            and 0 <= recovery_tolerance <= 5):
        motor.hold()
        raise ValueError('Invalid arm speed/tolerance/stall settings')

    start_raw = angle_sign * motor.angle()
    current = start_raw % 360
    # 시작 위치 허용치와 목표 도달 오차를 분리한다.
    # 0/360도 끝점 근처는 가장 가까운 실제 팔 구간으로 해석한다.
    if arm_name == 'R' and current <= start_tolerance:
        current += 360
    elif arm_name == 'L' and current >= 360 - start_tolerance:
        current -= 360
    if not (lower - start_tolerance <= current <= upper + start_tolerance):
        motor.hold()
        raise ValueError(arm_name + ' arm current angle outside mechanical range: ' + str(current))

    # 범위 밖에서 안쪽으로 복귀할 때 엔코더 흔들림 여유를 적용한다.
    recovery_lower = min(lower - tolerance, current - recovery_tolerance)
    recovery_upper = max(upper + tolerance, current + recovery_tolerance)
    delta = target_angle - current
    if abs(delta) <= tolerance:
        motor.hold()
        return True
    direction = 1 if delta > 0 else -1
    stop_raw = start_raw + delta
    last_progress_raw = start_raw
    progress_timer = StopWatch()
    completed = False
    old_pid = motor.control.pid()
    old_target_tolerances = motor.control.target_tolerances()
    old_limits = motor.control.limits()
    try:
        # 짧은 팔 이동에서 급가감속으로 목표를 지나치지 않도록 제한한다.
        old_acceleration = old_limits[1]
        if isinstance(old_acceleration, tuple):
            arm_acceleration = tuple(min(value, 2000) for value in old_acceleration)
        else:
            arm_acceleration = min(old_acceleration, 2000)
        motor.control.limits(acceleration=arm_acceleration)
        # 기본 모터 허용오차(11도)/적분 데드존(8도)이 5도 목표 판정과
        # 충돌하지 않도록 이번 동작 중에만 정밀도를 맞춘다.
        precision = tolerance
        motor.control.pid(integral_deadzone=min(old_pid[3], precision))
        motor.control.target_tolerances(
            speed=min(old_target_tolerances[0], 20),
            position=min(old_target_tolerances[1], precision))
        # 모터의 위치 제어로 목표에 접근하면서 감속한다.
        motor.run_target(abs(speed), angle_sign * stop_raw, wait=False)
        while True:
            current_raw = angle_sign * motor.angle()
            position = current + current_raw - start_raw
            if not (recovery_lower <= position <= recovery_upper):
                raise ValueError(arm_name + ' arm crossed mechanical range')
            recovery_lower = max(recovery_lower, min(lower - tolerance, position - recovery_tolerance))
            recovery_upper = min(recovery_upper, max(upper + tolerance, position + recovery_tolerance))
            if abs(stop_raw - current_raw) <= tolerance and motor.done():
                completed = True
                return True
            if direction * (current_raw - last_progress_raw) >= min_progress_deg:
                last_progress_raw = current_raw
                progress_timer.reset()
            elif progress_timer.time() >= stall_timeout:
                return False
            await wait(tLoop)
    finally:
        # 정상 도달은 run_target의 목표 위치 HOLD를 유지한다.
        # 정체/예외/취소는 현재 위치에서 즉시 정지한다.
        if not completed:
            motor.hold()
        motor.control.pid(integral_deadzone=old_pid[3])
        motor.control.target_tolerances(
            speed=old_target_tolerances[0], position=old_target_tolerances[1])
        motor.control.limits(acceleration=old_limits[1])


async def RightArmMove360(target_angle, speed=150):
    """오른팔 실제 목표 각도(180~360, 0=360). 속도 부호와 무관하게 방향 자동 결정."""
    await ArmMoveToAngle360(R_arm, target_angle, speed)


async def LeftArmMove360(target_angle, speed=150):
    """왼팔 실제 목표 각도(0~180, 360=0). 속도 부호와 무관하게 방향 자동 결정."""
    await ArmMoveToAngle360(L_arm, target_angle, speed)

# REF-V1.10: 이 아래 제어부는 통합 라이브러리와 동일하다.
gyroPD = (1100, 40000)
PD_DIVISOR = 10000
minSpeed = 40
accLength = 50#기존 130 > 80 
decLength = 210
gyroRatio = 1.000
TURN_SCALES = (50, 70, 100, 60, 45)
TURN_START = (5, 7)
TURN_REMAIN = (29, 17)
TURN_END = 1 #기존 3
YAW_SIGN = 1
MOTION_TIMEOUT_MS = 6000

heading = nominalHeading = yawReset = yaw = power = 0
kP = kD = lastError = 0
motion_status = 'idle'
_heading_ready = False


def resetYaw():
    global yawReset, heading, nominalHeading, _heading_ready
    yawReset = YAW_SIGN * hub.imu.heading()
    heading = nominalHeading = 0
    _heading_ready = True


def setHeading(degree):
    global heading, nominalHeading
    if not _heading_ready:
        resetYaw()
    heading = nominalHeading = degree


def getYaw():
    global yaw
    rawYaw = YAW_SIGN * hub.imu.heading() - yawReset
    yaw = rawYaw - round((rawYaw - heading) / 361) * 360
    return yaw


def acc(movedDistance, totalDistance, targetSpeed):
    speedChange = abs(targetSpeed) - minSpeed
    # Short moves: limit output by both ramps to avoid a sudden drop.
    if (speedChange > 0 and accLength > 0 and decLength > 0
            and 0 < totalDistance < accLength + decLength):
        progress = max(0, min(movedDistance, totalDistance))
        accelerating = minSpeed + speedChange * progress / accLength
        decelerating = minSpeed + speedChange * (totalDistance - progress) / decLength
        return min(abs(targetSpeed), accelerating, decelerating)
    if movedDistance <= accLength:
        speed = speedChange * (movedDistance / accLength) + minSpeed
    elif totalDistance - movedDistance <= decLength:
        speed = speedChange * ((totalDistance - movedDistance) / decLength) + minSpeed
    else:
        speed = abs(targetSpeed)
    return speed


def setPD(PD):
    global kP, kD, lastError
    kP, kD = PD
    lastError = 0


def PD(input1, input2):
    global lastError
    error = input1 - input2
    result = (error * kP + (error - lastError) * kD) * (abs(power) / PD_DIVISOR)
    lastError = error
    return result


def run(left, right):
    global LeftMotorPW, RightMotorPW
    LeftMotorPW = max(-10000, min(10000, round(left))) / 100
    RightMotorPW = max(-10000, min(10000, round(right))) / 100
    motorL.dc(LeftMotorPW)
    motorR.dc(RightMotorPW)


def stop():
    global LeftMotorPW, RightMotorPW
    LeftMotorPW = RightMotorPW = 0
    try:
        # motorL.dc(0)
        motorL.brake()
    finally:
        # motorR.dc(0)
        motorR.brake()


def mm_to_deg(mm):
    return mm * 360 / (pi * WheelD)


def _prepare_motion():
    if not hub.imu.ready():
        raise RuntimeError('imu_not_ready')
    if not _heading_ready:
        resetYaw()


async def move(speed, totalDistance, stall_timeout=200, min_progress_mm=3):
    global power, motion_status
    motion_status = 'running'
    reset_heading_after_stop = False
    try:
        if not (-100 <= speed <= 100) or speed == 0 or totalDistance <= 0:
            motion_status = 'invalid_move_input'
            return False
        if stall_timeout <= 0 or min_progress_mm <= 0:
            motion_status = 'invalid_stall_input'
            return False
        _prepare_motion()
        motorL.reset_angle(0)
        motorR.reset_angle(0)
        timer = StopWatch()
        progressTimer = StopWatch()
        lastProgress = movedDistance = 0
        progressStep = mm_to_deg(min_progress_mm)
        setPD(gyroPD)
        while movedDistance <= totalDistance:
            if timer.time() >= MOTION_TIMEOUT_MS:
                raise RuntimeError('motion_timeout')
            movedDistance = (abs(motorL.angle()) + abs(motorR.angle())) / 2
            power = acc(movedDistance, totalDistance, speed) * 100
            power = round((abs(speed) / speed) * power)
            getYaw()
            correction = round(PD(yaw, heading))
            run(power - correction, power + correction)
            if movedDistance >= lastProgress + progressStep:
                lastProgress = movedDistance
                progressTimer.reset()
            elif movedDistance <= totalDistance and progressTimer.time() >= stall_timeout:
                motion_status = 'motor_stall'
                # 이 로봇의 전후진 걸림은 벽 정렬 완료로 취급한다.
                reset_heading_after_stop = True
                return False
            await wait(0)
        motion_status = 'completed'
        return True
    except Exception as error:
        motion_status = str(error)
        raise
    finally:
        stop()
        if reset_heading_after_stop:
            # 구동 출력을 끈 뒤 현재 자세를 다음 이동/회전의 기준으로 삼는다.
            resetYaw()


async def steer(left, right, change):
    global heading, nominalHeading, motion_status
    motion_status = 'running'
    try:
        if left == right or change <= 0 or max(abs(left), abs(right)) > 100:
            motion_status = 'invalid_steer_input'
            return False
        _prepare_motion()
        angle = change * gyroRatio
        direction = 1 if left > right else -1
        heading += direction * angle
        nominalHeading += direction * change
        adjust = abs((left - right) / 100)
        getYaw()
        remaining = abs(yaw - heading)
        timer = StopWatch()
        while abs(remaining) >= TURN_END * adjust:
            if timer.time() >= MOTION_TIMEOUT_MS:
                raise RuntimeError('motion_timeout')
            getYaw()
            remaining = abs(yaw - heading)
            if angle - remaining <= TURN_START[0] * adjust:
                scale = TURN_SCALES[0]
            elif angle - remaining <= TURN_START[1] * adjust:
                scale = TURN_SCALES[1]
            elif remaining > TURN_REMAIN[0] * adjust:
                scale = TURN_SCALES[2]
            elif remaining > TURN_REMAIN[1] * adjust:
                scale = TURN_SCALES[3]
            else:
                scale = TURN_SCALES[4]
            run(left * scale, right * scale)
            await wait(0)
        motion_status = 'completed'
        return True
    except Exception as error:
        motion_status = str(error)
        raise
    finally:
        stop()


async def MoveStraight(Distance, Speed, Stopping=True, stall_timeout=200,
                       min_progress_mm=3):
    global motion_status
    if Distance == 0:
        stop()
        motion_status = 'completed'
        return True
    Speed = max(-100, min(100, Speed))
    return await move(Speed, mm_to_deg(abs(Distance)), stall_timeout, min_progress_mm)


async def TurnGyro_Control(targetAngle, max_pwr=90, min_pwr=40, tolerance=5,
                           stable_count=8, Stop=True, debug=False,
                           settle_ms=180, decel_mode='ORIGINAL'):
    global motion_status
    if targetAngle == 0:
        stop()
        motion_status = 'completed'
        ok = True
    else:
        speed = max(1, min(100, abs(max_pwr)))
        left = speed if targetAngle > 0 else -speed
        ok = await steer(left, -left, abs(targetAngle))
    return {'ok': ok, 'reason': motion_status, 'target_angle': targetAngle}





async def MoveStraight_blk_Control(Speed, Stop=True, black_threshold=20):
    """
    자이로로 직진하면서, 바닥의 검정 선(교차로)을 만나면 자동으로 정지한다.

    매개변수:
        Speed           - 이동 속도. 양수=전진, 음수=후진
        Stop            - 검정선 감지 후 완전 정지할지 여부 (기본 True)
        black_threshold - 이 반사값 이하면 "검정"으로 판단 (기본 20)
    """
    global _heading_ready
    _heading_ready = False
    global LeftMotorPW, RightMotorPW

    if Speed == 0:
        return

    motorL.reset_angle(0)
    motorR.reset_angle(0)
    LeftMotorPW = 0
    RightMotorPW = 0

    hub.imu.reset_heading(0)

    lastErr = 0


    while True:
        reflection = await sensor.reflection()


        # 검정 교차로 감지 시 즉시 정지 후 함수 종료
        if black_threshold >= reflection:
            motorL.dc(0)
            motorR.dc(0)
            LeftMotorPW = 0
            RightMotorPW = 0

            if Stop:
                motorL.brake()
                motorR.brake()

            return

        # 자이로 직진 보정
        angleErr = ThetaErr(0)
        err = (angleErr * GKp) + (angleErr - lastErr) * GKd
        lastErr = angleErr

        err = max(-MAX_U, min(MAX_U, err))

        await LeftControl(Speed, -err)
        await RightControl(Speed, err)

        await wait(tLoop)


async def TurnGyro_OneWheel_Control(targetAngle, moving_wheel="R", max_pwr=80, min_pwr=40, tolerance=5, stable_count=8, Stop=True ):
    """
    바퀴 한쪽만 굴려서 제자리 회전한다 (TurnGyro_Control과 달리 양쪽이 아닌 한쪽만 움직임).

    매개변수:
        targetAngle  - 회전할 각도(도), 현재 방향 기준 상대 각도
        moving_wheel - 움직일 바퀴. "R"/"right"=오른쪽 바퀴, "L"/"left"=왼쪽 바퀴 (기본 "R")
        max_pwr      - 최대 회전 출력 (기본 80)
        min_pwr      - 최소 회전 출력 보장값 (기본 30)
        tolerance    - 목표 각도로 인정할 오차 범위(도) (기본 5)
        stable_count - 오차범위 안에 이 횟수만큼 연속으로 머물러야 종료 (기본 8)
        Stop         - 종료 후 완전 정지할지 여부 (기본 True)
    """
    global _heading_ready
    _heading_ready = False
    global LeftMotorPW, RightMotorPW
    global MinSpeed, MaxSpeed

    old_MinSpeed = MinSpeed
    old_MaxSpeed = MaxSpeed

    MinSpeed = min_pwr
    MaxSpeed = max_pwr

    LeftMotorPW = 0
    RightMotorPW = 0

    hub.imu.reset_heading(0)
    await wait(100)

    # =========================
    # 바퀴 선택값 보정
    # R, r, right → 오른쪽 바퀴
    # L, l, left  → 왼쪽 바퀴
    # =========================
    moving_wheel = str(moving_wheel).lower()

    if moving_wheel == "r" or moving_wheel == "right":
        moving_wheel = "right"
    elif moving_wheel == "l" or moving_wheel == "left":
        moving_wheel = "left"
    else:
        moving_wheel = "right"   # 잘못 입력하면 기본값은 오른쪽

    lastErr = 0
    inRangeCount = 0

    while True:
        angleErr = ThetaErr(targetAngle)

        if abs(angleErr) <= tolerance:
            inRangeCount += 1
        else:
            inRangeCount = 0

        if inRangeCount >= stable_count:
            break

        turnPower = angleErr * GKp + (angleErr - lastErr) * GKd
        lastErr = angleErr

        if turnPower > max_pwr:
            turnPower = max_pwr
        elif turnPower < -max_pwr:
            turnPower = -max_pwr

        if abs(turnPower) < min_pwr:
            if turnPower > 0:
                turnPower = min_pwr
            else:
                turnPower = -min_pwr

        # =========================
        # 한쪽 바퀴만 회전
        # =========================
        if moving_wheel == "right":
            # 왼쪽 바퀴 고정, 오른쪽 바퀴만 회전
            motorL.brake()
            LeftMotorPW = 0

            await RightControl(turnPower, 0)

        else:
            # 오른쪽 바퀴 고정, 왼쪽 바퀴만 회전
            motorR.brake()
            RightMotorPW = 0

            await LeftControl(-turnPower, 0)

        await wait(tLoop)

    if Stop:
        motorL.dc(0)
        motorR.dc(0)
        await wait(100)
        # motorL.brake()
        # motorR.brake()

    LeftMotorPW = 0
    RightMotorPW = 0

    MinSpeed = old_MinSpeed
    MaxSpeed = old_MaxSpeed

    await wait(100)

async def TurnGyro_Curve_Control( targetAngle, base_pwr=80, max_turn=40, min_turn=30, tolerance=5, stable_count=5, Stop=True):
    """
    제자리 회전이 아니라, 전진하면서 곡선을 그리듯 방향을 targetAngle로 바꾼다.

    매개변수:
        targetAngle  - 도달할 목표 방향(도), 현재 방향 기준 상대 각도
        base_pwr     - 기본 전진 출력 (기본 80)
        max_turn     - 최대 회전 보정값 (기본 40)
        min_turn     - 최소 회전 보정 보장값 (기본 30)
        tolerance    - 목표 각도로 인정할 오차 범위(도) (기본 5)
        stable_count - 오차범위 안에 이 횟수만큼 연속으로 머물러야 종료 (기본 5)
        Stop         - 종료 후 완전 정지할지 여부 (기본 True)
    """
    global _heading_ready
    _heading_ready = False
    global LeftMotorPW, RightMotorPW
    global MinSpeed, MaxSpeed

    # 기존 MinSpeed, MaxSpeed 백업
    old_MinSpeed = MinSpeed
    old_MaxSpeed = MaxSpeed

    # 곡선 회전 중 사용할 최소/최대 속도 설정
    MinSpeed = 0
    MaxSpeed = 100

    # 모터 출력 초기화
    LeftMotorPW = 0
    RightMotorPW = 0

    # 현재 방향을 0도로 설정
    hub.imu.reset_heading(0)
    await wait(100)

    lastErr = 0
    inRangeCount = 0

    while True:
        # 목표 각도와 현재 각도의 차이 계산
        angleErr = ThetaErr(targetAngle)

        # 목표 각도 근처에 들어왔는지 확인
        if abs(angleErr) <= tolerance:
            inRangeCount += 1
        else:
            inRangeCount = 0

        # 목표 각도 근처에 일정 횟수 이상 머물면 종료
        if inRangeCount >= stable_count:
            break

        # 자이로 P + D 제어
        turnPower = angleErr * GKp + (angleErr - lastErr) * GKd
        lastErr = angleErr

        # 회전 보정값 제한
        if turnPower > max_turn:
            turnPower = max_turn
        elif turnPower < -max_turn:
            turnPower = -max_turn

        # 최소 회전 보정 보장
        if abs(turnPower) < min_turn:
            if turnPower > 0:
                turnPower = min_turn
            else:
                turnPower = -min_turn

        # =========================
        # 곡선 주행 회전
        # =========================
        left_pwr = base_pwr - turnPower
        right_pwr = base_pwr + turnPower

        # 출력 제한
        if left_pwr > 100:
            left_pwr = 100
        elif left_pwr < -100:
            left_pwr = -100

        if right_pwr > 100:
            right_pwr = 100
        elif right_pwr < -100:
            right_pwr = -100

        await LeftControl(left_pwr, 0)
        await RightControl(right_pwr, 0)

        await wait(tLoop)

    if Stop:
        motorL.dc(0)
        motorR.dc(0)
        await wait(100)
        motorL.brake()
        motorR.brake()

    LeftMotorPW = 0
    RightMotorPW = 0

    MinSpeed = old_MinSpeed
    MaxSpeed = old_MaxSpeed

    await wait(100)

async def LineFollow_Deg_Control(pwr, deg, line_side=1, kp=kP_line, kd=kD_line, Stop=True, min_pwr=60, accel_deg=300):
    """
    바닥 라인을 따라가며 지정한 거리(deg, 모터 회전각 기준)만큼 이동한다.

    매개변수:
        pwr       - 최대 속도. 양수=전진, 음수=후진
        deg       - 이동할 거리(모터 회전각 기준, dBaseENC() 단위)
        line_side - 라인 기준 방향. 양수=오른쪽 라인 추적, 음수=왼쪽 라인 추적 (기본 1)
        Stop      - 도착 후 완전 정지할지 여부 (기본 True)
        min_pwr   - 가속 구간의 최소 속도 (기본 60)
        accel_deg - 이 거리(deg)까지는 서서히 가속 (기본 300)
    """
    global _heading_ready
    _heading_ready = False
    global LeftMotorPW, RightMotorPW
    
    if pwr == 0:
        return

    motorL.reset_angle(0)
    motorR.reset_angle(0)
    LeftMotorPW = 0
    RightMotorPW = 0

    start = dBaseENC()
    line_err_old = 0
    sign = 1 if pwr > 0 else -1

    # line_side 값 보정
    # 양수면 오른쪽, 음수면 왼쪽
    if line_side >= 0:
        line_side = 1
    else:
        line_side = -1
    
    while abs(dBaseENC() - start) < deg:
        current_dist = abs(dBaseENC() - start)

        if current_dist < accel_deg:
            base_pwr = min_pwr + (abs(pwr) - min_pwr) * (current_dist / accel_deg)
        else:
            base_pwr = abs(pwr)

        reflection = await sensor.reflection()

        # 기본 오차
        line_err = 40 - reflection

        # 라인 기준 방향 선택
        line_err = line_err * line_side

        dline_err = line_err - line_err_old
        #print(line_err)

        abs_err = abs(line_err)

        if abs_err < 10:
            speed_scale = 1.0
        elif abs_err < 25:
            speed_scale = 0.85
        else:
            speed_scale = 0.70

        target_pwr = base_pwr * speed_scale
        current_pwr = target_pwr * sign

        U = line_err * kP_line + dline_err * kD_line

        # 후진할 때 보정 방향 반전
        if pwr < 0:
            U = -U

        U = max(-MAX_U, min(MAX_U, U))
        
        await LeftControl(current_pwr, U)
        await RightControl(current_pwr, -U)

        line_err_old = line_err
        await wait(tLoop)

    if Stop:
        motorL.dc(0)
        motorR.dc(0)
        LeftMotorPW = 0
        RightMotorPW = 0

async def LineFollow_color_Control(pwr, line_side=1, Stop=True, target_color=Color.BLUE, confirm_count=3):
    """
    라인팔로잉 중 바닥 센서가 지정한 색상을 감지하면 정지.
    
    target_color  : 감지할 색상 (Color.BLUE / Color.GREEN / Color.RED)
    confirm_count : 연속 감지 횟수 (기본 3회)
    """
    global _heading_ready
    _heading_ready = False
    global LeftMotorPW, RightMotorPW

    motorL.reset_angle(0)
    motorR.reset_angle(0)
    LeftMotorPW = 0
    RightMotorPW = 0

    line_err_old = 0
    sign = 1 if pwr > 0 else -1
    line_side = 1 if line_side >= 0 else -1

    color_count = 0

    while True:
        # ── 라인팔로잉 ──────────────────────────────
        reflection = await sensor.reflection()
        line_err = (40 - reflection) * line_side
        dline_err = line_err - line_err_old
        U = line_err * 0.7 + dline_err * 1
        if pwr < 0:
            U = -U
        U = max(-MAX_U, min(MAX_U, U))

        await LeftControl(abs(pwr) * sign, U)
        await RightControl(abs(pwr) * sign, -U)
        line_err_old = line_err

        # ── 색상 감지 ────────────────────────────────
        detected = await sensor.color()
        if detected == target_color:
            color_count += 1
        else:
            color_count = 0

        if color_count >= confirm_count:
            break

        await wait(tLoop)

    if Stop:
        motorL.dc(0)
        motorR.dc(0)
        LeftMotorPW = 0
        RightMotorPW = 0

async def LineFollow_color_Dynamic_Control(
    pwr,
    line_side=1,
    Stop=True,
    target_color=Color.BLUE,
    confirm_count=3,
    min_pwr=30,
    accel_deg=300,
    detect_kp=0.7,
    detect_kd=1.0,
    color_hue_tolerance=35,
    color_min_saturation=50,
    color_min_value=8,
    color_sample_loops=4,
    max_deg=None,
    log_hsv_every=0,
):
    """
    거리 기반 라인팔로잉 제어로 주행하다가 지정 색상을 감지하면 정지한다.

    일반 주행 중에는 LineFollow_Deg_Control과 같은 kP_line/kD_line,
    오차 기반 속도 보정을 사용한다. 목표 색상이 감지된 루프에서만
    detect_kp/detect_kd를 사용하므로 색상 위에서 급격히 틀어지는 현상을 줄인다.

    매개변수:
        pwr           - 최대 속도. 양수=전진, 음수=후진
        line_side     - 양수=오른쪽 라인, 음수=왼쪽 라인 추적
        Stop          - 종료 후 모터를 정지할지 여부
        target_color  - 정지할 색상
        confirm_count - 목표 색상 연속 감지 횟수
        min_pwr       - 출발 시 최소 속도
        accel_deg     - 가속 구간 길이(dBaseENC 도 단위)
        detect_kp/kd  - 목표 색상을 감지한 동안에만 사용할 낮은 PD 상수
        color_hue_tolerance - 목표 색조와 허용할 최대 차이(도)
        color_min_saturation- 무채색 경계를 제외할 최소 채도(%)
        color_min_value     - 검정 영역을 제외할 최소 밝기(%)
        color_sample_loops  - HSV 검사 간격(라인 제어 루프 수)
        max_deg       - 선택 안전 제한. 이 거리까지 색상이 없으면 False 반환
        log_hsv_every - 0이면 로그 없음. 양수면 해당 HSV 검사 횟수마다 출력

    반환값:
        True  - 목표 색상을 confirm_count회 연속 감지
        False - pwr가 0이거나 max_deg 안전 제한에 먼저 도달
    """
    global _heading_ready
    _heading_ready = False
    global LeftMotorPW, RightMotorPW

    if pwr == 0:
        return False

    motorL.reset_angle(0)
    motorR.reset_angle(0)
    LeftMotorPW = 0
    RightMotorPW = 0

    start = dBaseENC()
    line_err_old = 0
    sign = 1 if pwr > 0 else -1
    line_side = 1 if line_side >= 0 else -1
    confirm_count = max(1, confirm_count)
    color_sample_loops = max(1, color_sample_loops)
    start_pwr = min(abs(pwr), abs(min_pwr))
    color_count = 0
    found = False
    loop_count = 0
    color_sample_count = 0
    target_active = False

    while True:
        loop_count += 1
        current_dist = abs(dBaseENC() - start)
        if max_deg is not None and current_dist >= max_deg:
            break

        # reflection() 제어 주기를 안정적으로 유지하기 위해 평소에는 HSV를
        # 지정 간격으로만 읽는다. 색상이 한 번 후보로 잡히면 놓치지 않도록
        # 확인이 끝날 때까지 매 루프 연속 검사한다.
        sampled_color = (
            target_active
            or loop_count == 1
            or loop_count % color_sample_loops == 0
        )
        if sampled_color:
            color_sample_count += 1
            measured_hsv = await sensor.hsv()
            hue_error = abs(
                ((measured_hsv.h - target_color.h + 180) % 360) - 180
            )
            target_detected = (
                hue_error <= color_hue_tolerance
                and measured_hsv.s >= color_min_saturation
                and measured_hsv.v >= color_min_value
            )

            if log_hsv_every > 0 and color_sample_count % log_hsv_every == 0:
                # 기존 일반 출력문 주석 처리
                # print(
                #     "[LINE HSV]",
                #     measured_hsv.h,
                #     measured_hsv.s,
                #     measured_hsv.v,
                #     "hue_err:",
                #     hue_error,
                # )
                pass

            if target_detected:
                color_count += 1
                target_active = True
                if color_count >= confirm_count:
                    found = True
                    break
            else:
                color_count = 0
                target_active = False

        if accel_deg > 0 and current_dist < accel_deg:
            base_pwr = start_pwr + (
                (abs(pwr) - start_pwr) * (current_dist / accel_deg)
            )
        else:
            base_pwr = abs(pwr)

        reflection = await sensor.reflection()
        line_err = (40 - reflection) * line_side
        # HSV 모드 전환으로 길어진 루프에서 KD가 순간적으로 튀지 않도록
        # 해당 주기만 미분항을 제외한다.
        dline_err = 0 if sampled_color else line_err - line_err_old
        abs_err = abs(line_err)

        if abs_err < 10:
            speed_scale = 1.0
        elif abs_err < 25:
            speed_scale = 0.85
        else:
            speed_scale = 0.70

        current_pwr = base_pwr * speed_scale * sign

        if target_active:
            U = line_err * detect_kp + dline_err * detect_kd
        else:
            U = line_err * kP_line + dline_err * kD_line

        if pwr < 0:
            U = -U
        U = max(-MAX_U, min(MAX_U, U))

        await LeftControl(current_pwr, U)
        await RightControl(current_pwr, -U)

        line_err_old = line_err
        await wait(tLoop)

    if Stop:
        motorL.dc(0)
        motorR.dc(0)
        LeftMotorPW = 0
        RightMotorPW = 0

    return found

async def LineFollow_blk_Control(pwr,line_side=1,Stop=True, black_threshold=20):
    """
    바닥 라인을 따라가다가, 검정 선(교차로)을 만나면 자동으로 정지한다.

    매개변수:
        pwr             - 최대 속도. 양수=전진, 음수=후진
        line_side       - 라인 기준 방향. 양수=오른쪽 라인 추적, 음수=왼쪽 라인 추적 (기본 1)
        Stop            - 검정선 감지 후 완전 정지할지 여부 (기본 True)
        black_threshold - 이 반사값 이하면 "검정"으로 판단 (기본 20)
    """
    global _heading_ready
    _heading_ready = False
    global LeftMotorPW, RightMotorPW
    
    if pwr == 0:
        return

    motorL.reset_angle(0)
    motorR.reset_angle(0)
    LeftMotorPW = 0
    RightMotorPW = 0

    line_err_old = 0
    sign = 1 if pwr > 0 else -1

    # line_side 값 보정
    # 양수면 오른쪽, 음수면 왼쪽
    if line_side >= 0:
        line_side = 1
    else:
        line_side = -1

    current_pwr = 0
    U = 0

    while True:
        reflection = await sensor.reflection()
        # 검정이 일정 횟수 이상 연속 감지되면 정지
        if black_threshold >= reflection:
            break

        # 기본 오차
        line_err = 40 - reflection

        # 오른쪽 / 왼쪽 라인 기준 선택
        line_err = line_err * line_side

        dline_err = line_err - line_err_old

        abs_err = abs(line_err)


        current_pwr = abs(pwr) * sign

        U = line_err * 0.2 + dline_err * 0.5

        # 후진할 때 보정 방향 반전
        if pwr < 0:
            U = -U

        U = max(-MAX_U, min(MAX_U, U))
        
        await LeftControl(current_pwr, U)
        await RightControl(current_pwr, -U)

        line_err_old = line_err
        await wait(tLoop)

    if Stop:
        motorL.dc(0)
        motorR.dc(0)
        LeftMotorPW = 0
        RightMotorPW = 0

async def Color_Print(c):
    """색상 ID(c)에 맞는 색으로 허브 조명을 켠다. 매개변수: c - 색상 ID(1~6, 0이하는 꺼짐)"""
    if c == 1:
        hub.light.on(Color.BLACK)
    elif c == 2:
        hub.light.on(Color.BLUE)
    elif c == 3:
        hub.light.on(Color.GREEN)
    elif c == 4:
        hub.light.on(Color.YELLOW)
    elif c == 5:
        hub.light.on(Color.RED)
    elif c == 6:
        hub.light.on(Color.WHITE)
    else:
        hub.light.off()

def Color_Name(c):
    """색상 ID(c)를 사람이 읽을 수 있는 이름 문자열로 변환한다. 매개변수: c - 색상 ID(1~6)"""
    if c == UNKNOWN_COLOR: return "UNKNOWN"
    if c == 1: return "BLACK"
    elif c == 2: return "BLUE"
    elif c == 3: return "GREEN"
    elif c == 4: return "YELLOW"
    elif c == 5: return "RED"
    elif c == 6: return "WHITE"
    else: return "NONE"

def ScanSlotIndex(movedDistance):
    """
    스캔 시작점에서 이동한 모터 각도로 실제 물리 슬롯 인덱스(0~3)를 찾는다.

    첫 저장은 기존 조건과 동일하게 250도를 초과해야 하며, 슬롯 경계는
    SCAN_SLOT_CENTERS_DEG의 이웃한 두 중심값 사이의 중간값으로 계산한다.
    마지막 슬롯 구간을 지나간 값은 None을 반환하여 바닥/벽 색상이 저장되는 것을 막는다.
    """
    if movedDistance <= SCAN_FIRST_SAVE_DEG:
        return None

    centers = SCAN_SLOT_CENTERS_DEG
    for index in range(len(centers) - 1):
        boundary = (centers[index] + centers[index + 1]) / 2
        if movedDistance < boundary:
            return index

    lastHalfGap = (centers[-1] - centers[-2]) / 2
    if movedDistance <= centers[-1] + lastHalfGap:
        return len(centers) - 1
    return None

def ResolveScanSlotIndex(movedDistance, lastSavedSlotIndex, lastSavedDistance):
    """
    절대 스캔 위치와 직전 저장 위치의 간격을 함께 사용해 물리 슬롯을 확정한다.

    색상 하나를 놓쳐 감지 위치 사이가 약 2칸 이상 벌어졌다면 중간 슬롯은
    UNKNOWN_COLOR로 그대로 두고, 현재 색상을 그 다음 실제 슬롯에 저장한다.
    """
    physicalSlotIndex = ScanSlotIndex(movedDistance)

    if lastSavedSlotIndex is None:
        return physicalSlotIndex

    positionGap = movedDistance - lastSavedDistance
    slotStep = int(
        (positionGap + SCAN_SLOT_SPACING_DEG / 2)
        / SCAN_SLOT_SPACING_DEG
    )

    if slotStep < 2:
        return physicalSlotIndex

    inferredSlotIndex = lastSavedSlotIndex + slotStep
    if not 0 <= inferredSlotIndex < len(SCAN_SLOT_CENTERS_DEG):
        return physicalSlotIndex

    # 고정 경계가 현재 색상을 앞 슬롯으로 보더라도, 실제 이동 간격이
    # 더 큰 슬롯 번호를 가리키면 누락된 중간 슬롯을 보존한다.
    if physicalSlotIndex is None or inferredSlotIndex > physicalSlotIndex:
        return inferredSlotIndex

    return physicalSlotIndex

async def Color_Beep(c):
    """색상 ID(c)에 따라 다른 높이의 비프음을 낸다 (c==0이면 소리 없음). 매개변수: c - 색상 ID"""
    if c > 0:
        await hub.speaker.beep(640 + c * 400, 80)

async def Read_Color():
    """
    바닥 색상 센서(RGBW, HSV)를 읽어 현재 색상 ID를 판별한다.
    반환값: (색상ID, RGBW튜플, H, S, V) - 색상ID는 0=배경/무색, 1~6=BLACK/BLUE/GREEN/YELLOW/RED/WHITE
    """
    c = [0, 0, 0, 0, 0, 0, 0]

    s2rgb = await s2raw.read(5)
    s2hsv = await s2.hsv()

    r = s2rgb[0]
    g = s2rgb[1]
    b = s2rgb[2]
    w = s2rgb[3]

    h = s2hsv[0]
    s = s2hsv[1]
    v = s2hsv[2]

    if r + g + b < 20:
        c[0] += 0.5
    elif r > 2 * g:
        c[5] += 1
    elif r > 1.75 * b:
        c[4] += 1
    elif g > 1.5 * r and 130 < h < 175:
        c[3] += 1
    elif b > 1.8 * r:
        c[2] += 1
    elif r < 50 and g < 50 and b < 50:
        c[1] += 1
    else:
        c[6] += 1

    max_value = c[0]
    best = 0
    for i in range(7):
        if c[i] > max_value:
            max_value = c[i]
            best = i
    return best, s2rgb, h, s, v

async def Color_Measure():
    """색상 센서 값을 계속 읽으면서 조명/비프음으로 실시간 표시한다 (테스트/디버그용, 무한 루프)."""
    last_color = -1
    while True:
        best, rgb, h, s, v = await Read_Color()
        if best == 0:
            hub.light.off()
        else:
            await Color_Print(best)
        if best != last_color:
            if best != 0:
                await Color_Beep(best)
            last_color = best
        # 기존 일반 출력문 주석 처리
        # print("\r" + str(best), end="")
        pass
        await wait(100)

async def Scan(speed, totalDeg):
    """
    발굴 구역을 일직선으로 지나가며 4개 유물의 색상과 위치(mm)를 스캔해서
    전역 변수 slots, blockLocation에 저장한다.

    매개변수:
        speed    - 스캔 이동 속도
        totalDeg - 스캔할 총 거리(모터 회전각 기준, dBaseENC() 단위)

    결과 (전역 변수에 저장됨):
        slots         - 물리 위치를 보존한 색상 ID 리스트 [슬롯1, 슬롯2, 슬롯3, 슬롯4]
                        확정하지 못한 슬롯은 UNKNOWN_COLOR(-1)
        blockLocation - 색상ID를 인덱스로 하는 위치(mm) 리스트
    """
    global _heading_ready
    _heading_ready = False
    global blockLocation, slots, scanCompleted
    global LeftMotorPW, RightMotorPW

    blockLocation = [0, 0, 0, 0, 0, 0, 0]
    slots = [UNKNOWN_COLOR, UNKNOWN_COLOR, UNKNOWN_COLOR, UNKNOWN_COLOR]
    scanCompleted = False

    previousSavedColor = 0
    lastDistance = 0
    lastSavedSlotIndex = None

    lastReadColor = 0
    sameColorCount = 0
    stableCount = 3
    minGap = SCAN_FIRST_SAVE_DEG

    motorL.reset_angle(0)
    motorR.reset_angle(0)
    LeftMotorPW = 0
    RightMotorPW = 0
    hub.imu.reset_heading(0)

    start = dBaseENC()
    lastErr = 0

    try:
        while abs(dBaseENC() - start) <= abs(totalDeg):
            movedDistance = abs(dBaseENC() - start)

            angleErr = ThetaErr(0)
            err = (angleErr * GKp) + (angleErr - lastErr) * GKd
            lastErr = angleErr
            err = max(-MAX_U, min(MAX_U, err))

            await LeftControl(speed, -err)
            await RightControl(speed, err)

            color, rgb, h, s, v = await Read_Color()

            if color == 0:
                hub.light.off()
            else:
                await Color_Print(color)

            if color == lastReadColor:
                sameColorCount += 1
            else:
                sameColorCount = 1
                lastReadColor = color

            fixedSlotIndex = ScanSlotIndex(movedDistance)
            physicalSlotIndex = ResolveScanSlotIndex(
                movedDistance,
                lastSavedSlotIndex,
                lastDistance
            )

            # 0(이동 구간)과 6(판정 불가)은 저장하지 않는다.
            # 정상 색상 1~5가 3회 연속 감지되고, 직전 저장 위치에서 250도를
            # 초과했을 때만 이동 위치에 해당하는 실제 물리 슬롯에 저장한다.
            if (color in VALID_ARTIFACT_COLORS
                and sameColorCount >= stableCount
                and color != previousSavedColor
                and movedDistance - lastDistance > minGap
                and physicalSlotIndex is not None
                and slots[physicalSlotIndex] == UNKNOWN_COLOR):

                blockLocation[color] = round(movedDistance)
                slots[physicalSlotIndex] = color

                previousSavedColor = color
                lastDistance = movedDistance
                lastSavedSlotIndex = physicalSlotIndex

                await Color_Beep(color)

                if (fixedSlotIndex is not None
                    and physicalSlotIndex > fixedSlotIndex):
                    # 기존 일반 출력문 주석 처리
                    # print(
                    #     "[SCAN 위치 복구] 슬롯"
                    #     + str(fixedSlotIndex + 1)
                    #     + "은 UNKNOWN 유지 / 현재 색상은 슬롯"
                    #     + str(physicalSlotIndex + 1)
                    #     + "에 저장"
                    # )
                    pass

                # 기존 일반 출력문 주석 처리
                # print(
                #     "SAVE: slot", physicalSlotIndex + 1,
                #     color, Color_Name(color),
                #     "at", round(movedDistance),
                #     "RGBW:", rgb,
                #     "HSV:", h, s, v
                # )
                pass

            await wait(tLoop)

        scanCompleted = True
    except Exception as error:
        # 기존 일반 출력문 주석 처리
        # print("[SCAN 오류]", error)
        pass
        raise
    finally:
        # 센서 읽기나 제어 도중 오류가 발생해도 주행 모터는 반드시 정지한다.
        motorL.dc(0)
        motorR.dc(0)
        LeftMotorPW = 0
        RightMotorPW = 0

        # 기존 일반 출력문 주석 처리
        # print("blockLocation:", blockLocation)
        pass
        # 기존 일반 출력문 주석 처리
        # print("slots:", slots)
        pass

# ============================================================
# 11. 유물 픽업 미션 전용 로직 (WRO_pickup_mission_02.py 에서 이전됨)
# ============================================================

# ----------------------------------------------------------------
# 수치 조정 구역 (실제 로봇 테스트하면서 채워야 함)
# ----------------------------------------------------------------
SCAN_SPEED = 80
SCAN_DEG   = 1800

R_ARM_HOLD        = 350
R_ARM_PICK_SINGLE = 260   # 오른팔로 슬롯1 또는 슬롯2 "하나만"
R_ARM_PICK_DOUBLE = 240   # 오른팔로 슬롯1+슬롯2 "둘 다"

L_ARM_HOLD        = 10
L_ARM_PICK_SINGLE = 80
L_ARM_PICK_DOUBLE = 100   # 왼팔로 슬롯3+슬롯4 "둘 다"

# 큰 각도로 한번에 가지 않고, 가까운 것 -> 먼 것 순으로 2단계로 나눠 픽업할지 여부
STAGE_DOUBLE_PICK = True

# CASE2(Pair23 먼저 방문) 선택 기준: 남은 슬롯1·4의 존 간격이 이 값 이하일 때만 CASE2 사용
# (전체 120가지 배치로 검증: 2로 설정하면 span>=3인 비효율 케이스가 0건)
REMAINING_SPAN_LIMIT = 2


# ----------------------------------------------------------------
# 유물 처리 실행 로그 - 시뮬레이터와 같은 함수 단위로 순서를 출력
# ----------------------------------------------------------------
_step_count = 0

def _trace(name):
    """유물 처리 함수의 실제 실행 순서를 번호와 함께 출력한다."""
    global _step_count
    _step_count += 1
    function_name = name.split("(", 1)[0]
    print("[ARTIFACT " + str(_step_count) + "] " + function_name)


# ----------------------------------------------------------------
# 팔 제어 - 기본
# ----------------------------------------------------------------
async def r_pick_single():
    """오른팔로 유물 1개만 픽업한다 (R_ARM_PICK_SINGLE 각도까지 회전)."""
    _trace("r_pick_single() - 오른팔로 1개 픽업")
    await RightArmMove360(R_ARM_PICK_SINGLE, speed=150)
    await wait(200)


async def l_pick_single():
    """왼팔로 유물 1개만 픽업한다 (L_ARM_PICK_SINGLE 각도까지 회전)."""
    _trace("l_pick_single() - 왼팔로 1개 픽업")
    await LeftArmMove360(L_ARM_PICK_SINGLE, speed=150)
    await wait(200)


async def r_pick_double():
    """오른팔로 슬롯1+2 두 개를 순서대로 픽업한다 (STAGE_DOUBLE_PICK이 True면 가까운 것 -> 먼 것 2단계로 진행)."""
    _trace("r_pick_double() - 오른팔로 슬롯1+2 둘 다 픽업 (STAGE=" + str(STAGE_DOUBLE_PICK) + ")")
    if STAGE_DOUBLE_PICK:
        # 1단계: 가까운 유물(슬롯1) 먼저 정확히
        # 기존 일반 출력문 주석 처리
        # print("   -> 1단계: 슬롯1 먼저")
        pass
        await RightArmMove360(R_ARM_PICK_SINGLE, speed=250)
        await wait(150)
        # 2단계: 이어서 먼 유물(슬롯2)까지
        # 기존 일반 출력문 주석 처리
        # print("   -> 2단계: 슬롯2까지")
        pass
        await RightArmMove360(R_ARM_PICK_DOUBLE, speed=250)
        await wait(200)
    else:
        await RightArmMove360(R_ARM_PICK_DOUBLE, speed=300)
        await wait(200)


async def l_pick_double():
    """왼팔로 슬롯3+4 두 개를 순서대로 픽업한다 (STAGE_DOUBLE_PICK이 True면 가까운 것 -> 먼 것 2단계로 진행)."""
    _trace("l_pick_double() - 왼팔로 슬롯3+4 둘 다 픽업 (STAGE=" + str(STAGE_DOUBLE_PICK) + ")")
    if STAGE_DOUBLE_PICK:
        # 기존 일반 출력문 주석 처리
        # print("   -> 1단계: 슬롯3 먼저")
        pass
        await LeftArmMove360(L_ARM_PICK_SINGLE, speed=250)
        await wait(150)
        # 기존 일반 출력문 주석 처리
        # print("   -> 2단계: 슬롯4까지")
        pass
        await LeftArmMove360(L_ARM_PICK_DOUBLE, speed=250)
        await wait(200)
    else:
        await LeftArmMove360(L_ARM_PICK_DOUBLE, speed=300)
        await wait(200)


async def cross_pick():
    """Pair23 전용: 오른팔=슬롯2 하나, 왼팔=슬롯3 하나를 동시에 픽업한다."""
    _trace("cross_pick() - 오른팔(슬롯2)+왼팔(슬롯3) 동시에 각각 1개")
    await multitask(r_pick_single(), l_pick_single())


async def arm_reset():
    """양팔을 대기 각도(R_ARM_HOLD, L_ARM_HOLD)로 동시에 되돌린다."""
    _trace("arm_reset() - 팔 원위치")
    await multitask(
        LeftArmMove360(L_ARM_HOLD, speed=300),
        RightArmMove360(R_ARM_HOLD, speed=300)
    )


# ----------------------------------------------------------------
# 픽업 동작 - Pair 함수에서 분리됨
#   각도는 양팔의 실제 좌표로 구분한다. 같은 자세의 왼팔 각도는 360 - 오른팔 각도.
# ----------------------------------------------------------------
PICK_LIFT_ANGLE = 290  # 기존 이름은 오른팔 기준으로 유지
L_PICK_LIFT_ANGLE = 70
FIRST_PICK_ANGLE = 200   # 오른팔 첫 번째 유물 픽업 각도
SECOND_PICK_ANGLE = 270  # 오른팔 두 번째 유물 픽업 각도
L_FIRST_PICK_ANGLE = 180
L_SECOND_PICK_ANGLE = 90


def pickup_angle_for_stage(pickup_side, hand='R'):
    """적재 단계와 실제 팔에 맞는 목표 각도를 반환한다. 기존 1인자 호출은 오른팔 기준."""
    if hand == 'L':
        return L_FIRST_PICK_ANGLE if pickup_side == 'front' else L_SECOND_PICK_ANGLE
    if hand == 'R':
        return FIRST_PICK_ANGLE if pickup_side == 'front' else SECOND_PICK_ANGLE
    raise ValueError('Unknown arm: ' + str(hand))


def lift_arm(hand='both'):
    """
    이동 중 팔을 PICK_LIFT_ANGLE까지 들어올린다 (라인팔로잉과 동시에 진행 가능하도록 코루틴을 반환).
    매개변수: hand - 'both'/'R'/'L' 중 어느 팔을 들어올릴지
    주의: await 없이 multitask()에 그대로 넣어 쓰기 위해 코루틴 객체를 반환한다.
    """
    if hand == 'both':
        return multitask(
            RightArmMove360(PICK_LIFT_ANGLE, speed=400),
            LeftArmMove360(L_PICK_LIFT_ANGLE, speed=400)
        )
    elif hand == 'R':
        return RightArmMove360(PICK_LIFT_ANGLE, speed=400)
    else:
        return LeftArmMove360(L_PICK_LIFT_ANGLE, speed=400)


async def _noop():
    """아무 것도 안 함 (lift_free_arms에서 양손이 이미 다 차있을 때 사용)"""
    pass


def lift_free_arms(pickup_side='front'):
    """
    안전장치: 비어있는 손만 골라서 들어올린다 - 이미 뭔가 쥐고 있는 손은 절대 건드리지 않는다.
    (planner가 '양손 다 비어야 새 pick' 규칙을 지키므로 평소엔 항상 양손 다 비어있어야 정상이지만,
     혹시 모를 상황에 대비한 이중 안전장치)
    """
    side_hands = cargo[pickup_side]
    if side_hands['R'] is None and side_hands['L'] is None:
        return multitask(
            RightArmMove360(PICK_LIFT_ANGLE, speed=400),
            LeftArmMove360(L_PICK_LIFT_ANGLE, speed=400)
        )
    elif side_hands['R'] is None:
        physical_hand = physical_hand_for_side('R', pickup_side)
        if physical_hand == 'R':
            return RightArmMove360(PICK_LIFT_ANGLE, speed=400)
        return LeftArmMove360(L_PICK_LIFT_ANGLE, speed=400)
    elif side_hands['L'] is None:
        physical_hand = physical_hand_for_side('L', pickup_side)
        if physical_hand == 'R':
            return RightArmMove360(PICK_LIFT_ANGLE, speed=400)
        return LeftArmMove360(L_PICK_LIFT_ANGLE, speed=400)
    else:
        # 기존 일반 출력문 주석 처리
        # print("[경고] lift_free_arms: 양손이 이미 다 차있는 상태에서 Pair 방문 시도됨")
        pass
        return _noop()


async def grab_hand(hand, pickup_side='front'):
    """작업 면 기준 손을 실제 좌/우 팔 모터로 변환하여 한 손만 그랩한다."""
    physical_hand = physical_hand_for_side(hand, pickup_side)
    target_angle = pickup_angle_for_stage(pickup_side, physical_hand)
    _trace("grab_hand('" + hand + "', '" + pickup_side + "') - 논리 "
           + hand + " / 실제 " + physical_hand + "팔 그랩")
    if physical_hand == 'R':
        await RightArmMove360(target_angle, speed=150)
    else:
        await LeftArmMove360(target_angle, speed=150)


async def grab_both(pickup_side='front'):
    """현재 적재 단계의 각도까지 양팔을 움직여 유물 2개를 그랩한다."""
    _trace("grab_both() - 양팔 동시 그랩")
    r_target_angle = pickup_angle_for_stage(pickup_side, 'R')
    l_target_angle = pickup_angle_for_stage(pickup_side, 'L')
    await multitask(
        RightArmMove360(r_target_angle, speed=150),
        LeftArmMove360(l_target_angle, speed=150)
    )


# ----------------------------------------------------------------
# 팔 제어 - 드롭 (실제 로봇에서 각도 실측 필요)
# ----------------------------------------------------------------
R_ARM_DROP = 0    # TODO: 실측 - 오른팔이 유물을 내려놓는 각도
L_ARM_DROP = 0   # TODO: 실측 - 왼팔이 유물을 내려놓는 각도


async def r_drop(trace=True):
    """오른팔이 들고 있는 유물 내려놓기"""
    if trace:
        _trace("r_drop() - 오른팔 드롭")
    await RightArmMove360(R_ARM_DROP, speed=150)
    await wait(200)


async def l_drop(trace=True):
    """왼팔이 들고 있는 유물 내려놓기"""
    if trace:
        _trace("l_drop() - 왼팔 드롭")
    await LeftArmMove360(L_ARM_DROP, speed=300)
    await wait(200)


async def both_drop(pickup_side='front', drop_reversed=None):
    """현재 적재 단계의 양팔 유물을 동시에 내려놓는다."""
    _trace("both_drop() - 양팔 동시 드롭")
    await multitask(
        drop_hand_for_side('R', pickup_side, drop_reversed),
        drop_hand_for_side('L', pickup_side, drop_reversed)
    )


# ----------------------------------------------------------------
# 같은 팔이 2개를 순서대로 집었을 때의 부분 드롭 (STAGE_DOUBLE_PICK의 역동작)
#   stage1: 먼저 집힌 유물만 부분적으로 놓기 (나머지 하나는 계속 붙듦)
#   stage2: 나머지 유물까지 마저 놓기
# ----------------------------------------------------------------
R_ARM_DROP_STAGE1 = 0   # TODO: 실측 - 오른팔에서 먼저 집힌 유물만 놓는 각도 / 수정 전:260
R_ARM_DROP_STAGE2 = 190    # TODO: 실측 - 오른팔 나머지까지 마저 놓는 최종 각도

L_ARM_DROP_STAGE1 = 0   # TODO: 실측 - 왼팔에서 먼저 집힌 유물만 놓는 각도 / 수정 전:100
L_ARM_DROP_STAGE2 = 170   # TODO: 실측 - 왼팔 나머지까지 마저 놓는 최종 각도

# 두 번째 적재 묶음을 먼저 드롭할 때 사용하는 실측 각도.
# 첫 동작 오른팔 200도/왼팔 160도: 2차 유물을 드롭하고 1차 유물을 유지한다.
# 다음 동작 0도: 팔에 남아 있는 첫 유물을 최종 드롭한다.
R_ARM_REVERSE_DROP_STAGE1 = 200
R_ARM_REVERSE_DROP_STAGE2 = 0
L_ARM_REVERSE_DROP_STAGE1 = 160
L_ARM_REVERSE_DROP_STAGE2 = 0

# 기본 선호 순서. 안전한 역순 계획이 없으면 해당 미션만 정순으로 실행한다.
# 전역 값을 바꾸지 않고 선택한 순서를 실행/시뮬레이션/팔 제어에 전달한다.
DROP_BATCHES_REVERSED = True


async def r_drop_stage1():
    """오른팔: 순서대로 집은 2개 중 먼저 집힌 것만 부분적으로 내려놓는다 (나머지 하나는 계속 붙듦)."""
    _trace("r_drop_stage1() - 오른팔, 먼저 집힌 것만 부분 드롭")
    await RightArmMove360(R_ARM_DROP_STAGE1, speed=150)
    await wait(200)


async def r_drop_stage2():
    """오른팔: stage1 이후 남아있던 나머지 유물까지 마저 내려놓는다."""
    _trace("r_drop_stage2() - 오른팔, 나머지 마저 드롭")
    await RightArmMove360(R_ARM_DROP_STAGE2, speed=150)
    await wait(200)


async def l_drop_stage1():
    """왼팔: 순서대로 집은 2개 중 먼저 집힌 것만 부분적으로 내려놓는다 (나머지 하나는 계속 붙듦)."""
    _trace("l_drop_stage1() - 왼팔, 먼저 집힌 것만 부분 드롭")
    await LeftArmMove360(L_ARM_DROP_STAGE1, speed=150)
    await wait(200)


async def l_drop_stage2():
    """왼팔: stage1 이후 남아있던 나머지 유물까지 마저 내려놓는다."""
    _trace("l_drop_stage2() - 왼팔, 나머지 마저 드롭")
    await LeftArmMove360(L_ARM_DROP_STAGE2, speed=150)
    await wait(200)


async def r_drop_reverse_stage1():
    """오른팔: 나중에 집은 2차 유물을 먼저 드롭하고 1차 유물은 유지한다."""
    _trace("r_drop_reverse_stage1() - 오른팔, 2차 유물 먼저 드롭")
    await RightArmMove360(R_ARM_REVERSE_DROP_STAGE1, speed=150)
    await wait(200)


async def r_drop_reverse_stage2():
    """오른팔: 역순 1차 드롭 후 남은 1차 유물을 최종 드롭한다."""
    _trace("r_drop_reverse_stage2() - 오른팔, 남은 1차 유물 드롭")
    await RightArmMove360(R_ARM_REVERSE_DROP_STAGE2, speed=150)
    # await wait(200)


async def l_drop_reverse_stage1():
    """왼팔: 나중에 집은 2차 유물을 먼저 드롭하고 1차 유물은 유지한다."""
    _trace("l_drop_reverse_stage1() - 왼팔, 2차 유물 먼저 드롭")
    await LeftArmMove360(L_ARM_REVERSE_DROP_STAGE1, speed=150)
    # await wait(200)


async def l_drop_reverse_stage2():
    """왼팔: 역순 1차 드롭 후 남은 1차 유물을 최종 드롭한다."""
    _trace("l_drop_reverse_stage2() - 왼팔, 남은 1차 유물 드롭")
    await LeftArmMove360(L_ARM_REVERSE_DROP_STAGE2, speed=150)
    await wait(200)


# ----------------------------------------------------------------
# 슬롯 방문 함수 (위치 정렬 전용 - 그랩 동작은 grab_hand/grab_both가,
#   박물관 쪽 이동은 GoToMuseumFromPairXX()가 담당)
# ----------------------------------------------------------------
# 하위 로직의 구조를 보존하기 위한 적재 단계 키.
# 이름은 기존 planner와의 호환을 위해 유지하지만 물리적인 전/후면을 뜻하지 않는다.
PICKUP_FRONT = 'front'  # 첫 번째 적재 단계
PICKUP_REAR = 'rear'    # 두 번째 적재 단계


def _check_side(side):
    """첫 번째/두 번째 적재 단계 이외의 값을 조기에 차단한다."""
    if side not in (PICKUP_FRONT, PICKUP_REAR):
        raise ValueError("정의되지 않은 적재 단계: " + str(side))


def physical_hand_for_side(hand, side):
    """
    적재 단계와 관계없이 논리 R/L을 같은 실제 차체 팔에 연결한다.

    side는 하위 호환을 위해 유지하지만 물리 방향이 아니라
    첫 번째/두 번째 적재 공간을 구분하는 값이다.
    """
    _check_side(side)
    if hand not in ('R', 'L'):
        raise ValueError("정의되지 않은 손: " + str(hand))

    # if side == PICKUP_FRONT:
    return hand
    # return 'L' if hand == 'R' else 'R'


async def drop_hand_for_side(hand, side, drop_reversed=None):
    """한 팔에 실린 첫 번째/두 번째 유물을 적재 순서에 맞춰 드롭한다."""
    global partially_unloaded_arms
    physical_hand = physical_hand_for_side(hand, side)
    first_item_loaded = cargo[PICKUP_FRONT][hand] is not None
    second_item_loaded = cargo[PICKUP_REAR][hand] is not None

    # 역순 드롭: 2차 적재 유물을 먼저 놓고 1차 적재 유물을 유지한다.
    if drop_reversed is None:
        drop_reversed = DROP_BATCHES_REVERSED
    if drop_reversed:
        if side == PICKUP_REAR and first_item_loaded:
            partially_unloaded_arms.add(hand)
            if physical_hand == 'R':
                await r_drop_reverse_stage1()
            else:
                await l_drop_reverse_stage1()
            return

        # 2차 적재 유물을 먼저 놓은 팔의 남은 1차 유물을 최종 드롭한다.
        if side == PICKUP_FRONT and hand in partially_unloaded_arms:
            partially_unloaded_arms.discard(hand)
            if physical_hand == 'R':
                await r_drop_reverse_stage2()
            else:
                await l_drop_reverse_stage2()
            return

    # 첫 번째 유물을 놓을 때 두 번째 유물이 남아 있으면 부분 드롭한다.
    if side == PICKUP_FRONT and second_item_loaded:
        partially_unloaded_arms.add(hand)
        if physical_hand == 'R':
            await r_drop_stage1()
        else:
            await l_drop_stage1()
        return

    # 부분 드롭 이후에는 같은 팔의 나머지 유물을 최종 드롭한다.
    if side == PICKUP_REAR and hand in partially_unloaded_arms:
        partially_unloaded_arms.discard(hand)
        if physical_hand == 'R':
            await r_drop_stage2()
        else:
            await l_drop_stage2()
        return

    # 해당 팔에 유물이 하나뿐이면 기존 단일 드롭을 사용한다.
    if physical_hand == 'R':
        await r_drop()
    else:
        await l_drop()


async def ApproachPair(distance, speed, pickup_side=PICKUP_FRONT, hand='both'):
    """Pair 접근 시 필요한 팔을 준비한다.

    첫 번째 적재: 지정한 팔을 0도로 내린다(L/R/both).
    두 번째 적재: 기존 적재를 유지하며 지정 거리만큼 전진한다.
    """
    _check_side(pickup_side)
    if hand not in ('L', 'R', 'both'):
        raise ValueError("정의되지 않은 손: " + str(hand))
    if pickup_side == PICKUP_REAR:
        return await MoveStraight(distance, abs(speed))
    if hand == 'L':
        return await LeftArmMove360(0, 800)
    if hand == 'R':
        return await RightArmMove360(0, 800)
    return await multitask(
        RightArmMove360(0, 800),
        LeftArmMove360(0, 800)
    )


async def Pair12(pickup_side=PICKUP_FRONT):
    """슬롯1-2 위치로 정렬. 매개변수 없음 - 위치 정렬만 수행(그랩/이후 이동 없음)."""
    _trace("Pair12() - 슬롯1-2 위치로 이동")
    await multitask(
        # both_drop(),
        LineFollow_Deg_Control(60,250,-1)
    )
    await LineFollow_color_Control(34,-1,True,Color.GREEN)
    # await wait(100)
    await MoveStraight(180 if pickup_side == 'front' else 70,-80) #100 if pickup_side == PICKUP_REAR else 70
    await TurnGyro_Control(88,90)
    await MoveStraight(68,80)
    # await wait(300)
    await TurnGyro_OneWheel_Control(-81.5,'R',90)
    await wait(100)
    await ApproachPair(150 if pickup_side == 'front' else 100, 40, pickup_side)
    await wait(100)
    await MoveStraight(120, 50 if pickup_side == 'front' else 80)


async def GoToMuseumFromPair12(pickup_side=PICKUP_FRONT):
    """Pair12에서 그랩 완료 후 박물관 쪽으로 이동 (기존 Pair12() 뒷부분 그대로 보존)."""
    _trace("GoToMuseumFromPair12() - 박물관으로 이동")
    await wait(100)
    _check_side(pickup_side)
    await MoveStraight(600, -80)
    await TurnGyro_Control(-90, 90)
    await wait(150)

    await MoveStraight_blk_Control(50)
    await MoveStraight(45,50)

    await TurnGyro_Control(-90,90)


async def Pair23(pickup_side=PICKUP_FRONT):
    """슬롯2-3 가운데 위치로 정렬. 매개변수 없음 - 위치 정렬만 수행."""
    _trace("Pair23() - 슬롯2-3 가운데 위치로 이동")
    await multitask(
        # both_drop(),
        LineFollow_Deg_Control(40,250,-1)
    )
    await wait(150)
    # await LineFollow_Deg_Control(30,100,-1)
    await LineFollow_color_Control(40,-1,True,Color.GREEN)
    await TurnGyro_Control(5,80)
    await MoveStraight(130 if pickup_side == 'front' else 20,-80 if pickup_side == 'front' else 40)#-80 if pickup_side == PICKUP_FRONT else 80
    await ApproachPair(200 if pickup_side == 'front' else 80, 40, pickup_side)
    await MoveStraight(90 if pickup_side == 'front' else 300,50 if pickup_side == 'front' else 80)


async def GoToMuseumFromPair23(pickup_side=PICKUP_FRONT):
    """Pair23에서 그랩 완료 후 박물관 쪽으로 이동 (기존 Pair23() 뒷부분 그대로 보존)."""
    _trace("GoToMuseumFromPair23() - 박물관으로 이동")
    _check_side(pickup_side)
    await MoveStraight(600, -80)
    await wait(100)
    await TurnGyro_Control(180, 90)


async def Pair34(pickup_side=PICKUP_FRONT):
    """슬롯3-4 위치로 정렬. 매개변수 없음 - 위치 정렬만 수행."""
    _trace("Pair34() - 슬롯3-4 위치로 이동")
    await multitask(
        #both_drop(),
        LineFollow_Deg_Control(60,250,-1)
    )
    await LineFollow_color_Control(30,-1,True,Color.GREEN)
    await wait(100)
    #await MoveStraight(70,-80)
    await MoveStraight(173 if pickup_side == 'front' else 70,-80)
    await TurnGyro_Control(-90,90)
    await MoveStraight(40,80)
    await TurnGyro_OneWheel_Control(88,'L',90)
    await wait(100)
    await ApproachPair(200 if pickup_side == 'front' else 130, 40, pickup_side)
    await MoveStraight(100,60 if pickup_side == 'front' else 80)
    


async def GoToMuseumFromPair34(pickup_side=PICKUP_FRONT):
    """Pair34에서 그랩 완료 후 박물관 쪽으로 이동 (기존 Pair34() 뒷부분 그대로 보존)."""
    _trace("GoToMuseumFromPair34() - 박물관으로 이동")
    await wait(100)
    _check_side(pickup_side)
    await MoveStraight(650, -80)
    await TurnGyro_Control(90, 90)
    await MoveStraight_blk_Control(60)
    #await MoveStraight(9,80)
    await TurnGyro_Control(93,90)
    await wait(100)


async def Pair01(pickup_side=PICKUP_FRONT):
    """슬롯1을 왼손으로 잡을 수 있는 위치로 정렬 (짝 슬롯 없음 - 항상 단독 안전). 매개변수 없음."""
    _trace("Pair01() - 슬롯1 왼손 전용 위치로 이동")
    # TODO: 실측 필요 - 아직 실제 이동 코드 없음
    await multitask(
        # both_drop(),
        LineFollow_Deg_Control(60,250,-1)
    )
    await LineFollow_color_Control(30,-1,True,Color.GREEN)
    await wait(100)
    await MoveStraight(200 if pickup_side == 'front' else 70,-80)
    await TurnGyro_Control(90,90)
    await MoveStraight(193,80)
    await TurnGyro_OneWheel_Control(-83,'R',90)
    await wait(100)#100 if pickup_side == 'front' else 50
    # await ApproachPair(100, 40, pickup_side)
    await ApproachPair(150 if pickup_side == 'front' else 100, 40, pickup_side, hand='L')
    await MoveStraight(100,50 if pickup_side == 'front' else 80)
    pass


async def GoToMuseumFromPair01(pickup_side=PICKUP_FRONT):
    """Pair01에서 그랩 완료 후 박물관 쪽으로 이동."""
    _trace("GoToMuseumFromPair01() - 박물관으로 이동")
    # TODO: 실측 필요
    await wait(100)
    _check_side(pickup_side)
    await MoveStraight(600, -80)
    await TurnGyro_Control(-90, 90)
    await wait(150)

    await MoveStraight_blk_Control(50)
    await MoveStraight(45,50)

    await TurnGyro_Control(-90,90)
    pass


async def Pair45(pickup_side=PICKUP_FRONT):
    """슬롯4를 오른손으로 잡을 수 있는 위치로 정렬 (짝 슬롯 없음 - 항상 단독 안전). 매개변수 없음."""
    _trace("Pair45() - 슬롯4 오른손 전용 위치로 이동")
    # TODO: 실측 필요 - 아직 실제 이동 코드 없음
    await multitask(
        # both_drop(),
        LineFollow_Deg_Control(60,250,-1)
    )
    await LineFollow_color_Control(30,-1,True,Color.GREEN)
    await wait(100)
    await MoveStraight(180 if pickup_side == 'front' else 70,-80)
    await TurnGyro_Control(-90,90)
    await MoveStraight(160,80)
    await TurnGyro_OneWheel_Control(88,'L',90)
    await wait(100)
    await ApproachPair(200 if pickup_side == 'front' else 100, 40, pickup_side, hand='R')
    await MoveStraight(120,60 if pickup_side == 'front' else 80)
    pass


async def GoToMuseumFromPair45(pickup_side=PICKUP_FRONT):
    """Pair45에서 그랩 완료 후 박물관 쪽으로 이동."""
    _trace("GoToMuseumFromPair45() - 박물관으로 이동")
    # TODO: 실측 필요
    # await wait(100)
    _check_side(pickup_side)
    await MoveStraight(630, -80)
    await TurnGyro_Control(100, 90)

    await MoveStraight_blk_Control(50)
    await MoveStraight(10,40)
    #await MoveStraight(9,80)
    await TurnGyro_Control(98,90)
    # await wait(100)
    pass


PAIR_FUNCS = {'Pair01': Pair01, 'Pair12': Pair12, 'Pair23': Pair23,
              'Pair34': Pair34, 'Pair45': Pair45}
GOTO_MUSEUM_FROM_PAIR = {'Pair01': GoToMuseumFromPair01, 'Pair12': GoToMuseumFromPair12,
                          'Pair23': GoToMuseumFromPair23, 'Pair34': GoToMuseumFromPair34,
                          'Pair45': GoToMuseumFromPair45}


# ----------------------------------------------------------------
# Pair -> Pair 직접 이동 (2026-09-18)
# 최초 진입은 기존 PairXX(), 연결 이동은 MoveBetweenPairs()를 사용한다.
# Zone01~Zone45와 동일한 좌표/간격을 초기값으로 사용한다. Pair56은 없다.
# Pair와 Zone의 보정은 별도이며, 아래 숫자는 Pair 실물 보정 전 초기값이다.
# ----------------------------------------------------------------
PAIR_POSITION_MM = {
    'Pair01': -324,
    'Pair12': -175,
    'Pair23': -60,
    'Pair34': 48.5,
    'Pair45': 180,
}

# 양수: 더 멀리, 음수: 더 짧게. 반대 방향은 별도로 설정한다.
PAIR_TRANSITION_ADJUST_MM = {
    ('Pair01', 'Pair45'): 15,
    ('Pair01', 'Pair23'): -5,
    ('Pair01', 'Pair34'): 10,
    ('Pair12', 'Pair23'): 28,
    ('Pair12', 'Pair34'): 42,
    ('Pair12', 'Pair45'): 50,
    ('Pair23', 'Pair45'): 20,
    ('Pair23', 'Pair34'): 24,
    ('Pair45', 'Pair12'): 38,
    ('Pair45', 'Pair23'): 20,
    ('Pair34', 'Pair12'): 32,
    ('Pair34', 'Pair01'): 10,
    ('Pair23', 'Pair12'): 23,
    ('Pair34', 'Pair23'): 20,
    ('Pair23', 'Pair01'): 27,
    # ('Pair34', 'Pair12'): -5,
}


async def MoveBetweenPairs(
    from_pair, to_pair,
    from_side=PICKUP_FRONT, to_side=PICKUP_FRONT
):
    """벽정렬(front만) -> 후진 -> 포인트 턴 -> 거리 이동 -> 복원 -> 접근.

    from_side: 현재 픽업 완료 상태. 출발 벽정렬 여부를 결정한다.
    to_side: 다음 픽업 상태. 첨부본의 후진 거리와 목적 Pair 접근을 결정한다.
    front/rear는 적재 단계이며 로봇의 물리적 앞뒤 방p향이 아니다.
    """
    _check_side(from_side)
    _check_side(to_side)
    if from_pair not in PAIR_POSITION_MM or to_pair not in PAIR_POSITION_MM:
        raise ValueError('정의되지 않은 Pair: ' + str((from_pair, to_pair)))
    if from_pair == to_pair:
        return

    signed_distance = PAIR_POSITION_MM[to_pair] - PAIR_POSITION_MM[from_pair]
    base_distance_mm = abs(signed_distance)
    adjust = PAIR_TRANSITION_ADJUST_MM.get((from_pair, to_pair), 0)
    distance_mm = base_distance_mm + adjust
    if signed_distance == 0 or not (0 < distance_mm < float('inf')):
        raise ValueError('Pair 좌표 차이와 보정 후 거리는 0보다 커야 합니다.')

    _trace('MoveBetweenPairs(' + from_pair + ' -> ' + to_pair + ')')
    print('[PAIR 이동 경로]', from_pair, '->', to_pair,
          '/ 상태=' + from_side + ' -> ' + to_side,
          '/ 기존 거리=' + str(base_distance_mm) + 'mm',
          '/ 보정=' + ('+' if adjust >= 0 else '') + str(adjust) + 'mm',
          '/ 최종 거리=' + str(distance_mm) + 'mm')

    # 1. front 출발만 전진 벽정렬. 첨부본의 150mm/출력50을 유지한다.
    # 이 move()는 걸림을 motor_stall/False로 반환하고 방향 기준을 재설정한다.
    # 지정 거리 완료 또는 motor_stall 벽 접촉이면 다음 동작을 진행한다.
    if from_side == PICKUP_FRONT:
        result = await MoveStraight(180, 30)
        if result is False and motion_status != 'motor_stall':
            raise RuntimeError('pair_wall_alignment_failed: ' + str(motion_status))
        await wait(100)

    # 2. 후진 거리 조정: front는 벽정렬 완료 위치, rear는 현재 픽업 위치 기준.
    # rear 픽업 위치의 벽으로부터 떨어진 양을 포함하여 같은 통로에 맞춘다.
    # 첨부본 유지: 다음 픽업(to_side)이 front면 280mm, rear면 150mm.
    retreat_mm = 220 if to_side == PICKUP_FRONT else 150
    if await MoveStraight(retreat_mm, -80) is False:
        raise RuntimeError('pair_retreat_failed: ' + str(motion_status))
    await wait(100)

    # 3. 다음 Pair 방향으로 포인트 턴. 발굴 구역은 Zone과 회전 부호가 반대.
    turn_angle = -90 if signed_distance > 0 else 90
    result = await TurnGyro_Control(turn_angle, 90)
    if not result['ok']:
        raise RuntimeError('pair_enter_turn_failed: ' + str(result.get('reason', motion_status)))
    await wait(100)

    # 4. 좌표 차이 + 방향별 보정값만큼 옆으로 직진한다.
    if await MoveStraight(distance_mm, 80) is False:
        raise RuntimeError('pair_lateral_failed: ' + str(motion_status))
    await wait(100)

    # 5. 반대 포인트 턴으로 픽업 방향을 복원한다. 한쪽 바퀴 회전은 사용하지 않는다.
    result = await TurnGyro_Control(-turn_angle, 90)
    if not result['ok']:
        raise RuntimeError('pair_leave_turn_failed: ' + str(result.get('reason', motion_status)))
    await wait(100)

    # 6. 목적 Pair 접근. 기존 Pair 후반부의 접근 거리/속도를 초기값으로 옮겼다.
    # 포인트 턴과 새 통로 기준에 맞춰 아래 값을 실측 조정한다.
    # approach_mm은 rear에서만 전진에 사용된다(front는 빈 팔 준비만 수행).
    if to_pair == 'Pair01':
        approach_mm, final_mm, front_speed, hand = 100, 120, 30, 'L'
    elif to_pair == 'Pair12':
        approach_mm, final_mm, front_speed, hand = 100, 120, 30, 'both'
    elif to_pair == 'Pair23':
        approach_mm, final_mm, front_speed, hand = 100, 120 if to_side == PICKUP_FRONT else 300, 30, 'both'
    elif to_pair == 'Pair34':
        approach_mm, final_mm, front_speed, hand = 100, 120, 30, 'both'
    else:  # Pair45
        approach_mm, final_mm, front_speed, hand = 100, 120, 30, 'R'

    approach_wall_aligned = False
    if to_side == PICKUP_REAR:
        result = await ApproachPair(approach_mm, 30, to_side, hand)
        if result is False:
            if motion_status == 'motor_stall':
                approach_wall_aligned = True
            else:
                raise RuntimeError('pair_approach_failed: ' + str(motion_status))
    else:
        # 연결 픽업에서는 이미 적재한 팔을 내리지 않고 필요한 빈 팔만 준비한다.
        if hand in ('R', 'both') and not arm_has_cargo('R'):
            await ApproachPair(0, 40, to_side, 'R')
        if hand in ('L', 'both') and not arm_has_cargo('L'):
            await ApproachPair(0, 40, to_side, 'L')
    await wait(100)
    # 이미 벽에 닿았으면 추가 전진을 생략하고 픽업으로 이어간다.
    if not approach_wall_aligned:
        result = await MoveStraight(final_mm, front_speed if to_side == PICKUP_FRONT else 30)
        if result is False and motion_status != 'motor_stall':
            raise RuntimeError('pair_final_approach_failed: ' + str(motion_status))
    await wait(100)


# 기존 Bridge는 보존하지만 goto_pair()의 연결 이동에서는 호출하지 않는다.
# ----------------------------------------------------------------
# Pair -> Pair 다리(bridge) 함수 - 박물관을 거치지 않고 발굴구역 안에서
#   곧바로 "다른 Pair"로 이동할 때 필요하다 (예: Pair12에서 픽업 후 곧바로 Pair34로).
#   각 Pair 함수는 "발굴구역 기준점"에서 출발한다고 가정하고 실측되어 있어서,
#   Pair12()가 끝난 자리에서 곧바로 Pair34()를 부르면 기준점이 어긋난다.
#   그래서 Zone 쪽 RecenterFromZoneXX()와 같은 원리로, 출발 Pair마다 전용 다리 함수를 둔다.
#
#   Pair01/Pair12는 같은 코드, Pair34/Pair45는 회전 방향만 반대(부호 반전), Pair23은 회전 없음.
# ----------------------------------------------------------------
async def BridgeFromPair01(pickup_side=PICKUP_FRONT):
    """Pair01에서 그랩 완료 후, 곧바로 다른 Pair로 이동하기 위한 다리 함수."""
    _trace("BridgeFromPair01() - 다음 슬롯으로 이동")
    await wait(100)
    _check_side(pickup_side)
    await MoveStraight(280, -80)
    # await wait(300)
    await TurnGyro_Control(-90, 90)
    # await wait(300)
    await MoveStraight_blk_Control(80)
    await MoveStraight(15,80)
    # await TurnGyro_Control(90,90)
    await multitask(
        RightArmMove360(200, 800),
        TurnGyro_Control(90,90)
    )


async def BridgeFromPair12(pickup_side=PICKUP_FRONT):
    """Pair12에서 그랩 완료 후, 곧바로 다른 Pair로 이동하기 위한 다리 함수 (Pair01과 동일)."""
    _trace("BridgeFromPair12() - 다음 슬롯으로 이동")
    await wait(100)
    _check_side(pickup_side)
    await MoveStraight(230, -80)
    await wait(100)
    await TurnGyro_Control(-90, 90)
    await wait(150)
    await MoveStraight_blk_Control(80)
    await MoveStraight(15,80)
    await TurnGyro_Control(90,90)#100 if pickup_side == PICKUP_REAR else 70

async def BridgeFromPair23(pickup_side=PICKUP_FRONT):
    """Pair23에서 그랩 완료 후, 곧바로 다른 Pair로 이동하기 위한 다리 함수 (회전 없음)."""
    _trace("BridgeFromPair23() - 다음 슬롯으로 이동")
    await wait(100)
    _check_side(pickup_side)
    await MoveStraight(280, -80)

async def BridgeFromPair34(pickup_side=PICKUP_FRONT):
    """Pair34에서 그랩 완료 후, 곧바로 다른 Pair로 이동하기 위한 다리 함수 (회전 방향 반대)."""
    _trace("BridgeFromPair34() - 다음 슬롯으로 이동")
    await wait(100)
    _check_side(pickup_side)
    await MoveStraight(200, -80)
    # await wait(300)
    await TurnGyro_Control(90, 90)
    # await wait(300)
    await MoveStraight_blk_Control(80)
    # await MoveStraight(45,80)
    await TurnGyro_Control(-90,90)


async def BridgeFromPair45(pickup_side=PICKUP_FRONT):
    """Pair45에서 그랩 완료 후, 곧바로 다른 Pair로 이동하기 위한 다리 함수 (Pair34와 동일)."""
    _trace("BridgeFromPair45() - 다음 슬롯으로 이동")
    await wait(100)
    _check_side(pickup_side)
    await MoveStraight(200, -80)
    await TurnGyro_Control(90, 90)
    await MoveStraight_blk_Control(80)
    await TurnGyro_Control(-90,90)


BRIDGE_FROM_PAIR = {
    'Pair01': BridgeFromPair01, 'Pair12': BridgeFromPair12,
    'Pair23': BridgeFromPair23,
    'Pair34': BridgeFromPair34, 'Pair45': BridgeFromPair45,
}


async def ApproachZone(distance, drop_side=PICKUP_FRONT):
    """적재 단계와 관계없이 전면 자세로 드롭 위치에 접근한다."""
    _check_side(drop_side)
    return await MoveStraight(distance, abs(ZONE_APPROACH_SPEED))



async def Zone01(drop_side=PICKUP_FRONT):
    """오른손=존1(RED), 왼쪽은 바깥/빈 공간 - 짝 존 없음(단독). 매개변수 없음."""
    _trace("Zone01() - 존1 오른손 전용 위치로 이동")
    # TODO: 실측 필요 - 아직 실제 이동 코드 없음
    await wait(100)
    await LineFollow_Deg_Control(30,200,1)
    await LineFollow_color_Control(30,1,True,Color.RED)
    await MoveStraight(60,-70)
    await wait(120)
    await TurnGyro_Control(-90,90)
    await wait(120)
    await MoveStraight(325,90)
    await wait(100)
    await TurnGyro_Control(87,90)
    await wait(150)
    await ApproachZone(230, drop_side)
    await MoveStraight(110 if drop_side == 'front' else 20,-40)
    # await MoveStraight(20,-40)
    await wait(150)

    pass


async def Zone12(drop_side=PICKUP_FRONT):
    """RED(존1)-GREEN(존2) 진열대 위치로 이동. 매개변수 없음."""
    _trace("Zone12() - 존1-2 위치로 이동")
    # TODO
    # await multitask(
    #     RightArmMove360(290, 800),
    #     LeftArmMove360(70, 800)
    # )
    await wait(100)
    await LineFollow_Deg_Control(50,200,1)
    await LineFollow_color_Control(30,1,True,Color.RED)
    await MoveStraight(60,-70)
    await wait(120)
    # await multitask(
    #     RightArmMove360(240, -700),
    #     LeftArmMove360(240, -700)
    await TurnGyro_Control(-90,90)
    await MoveStraight(210,90)
    await wait(100)
    await TurnGyro_Control(90,90)
    await wait(150)
    await ApproachZone(230, drop_side)
    await MoveStraight(110 if drop_side == 'front' else 20,-40)
    # await MoveStraight(20,-40)
    # await wait(150)
    # await MoveStraight(250, -60)

    pass


async def Zone23(drop_side=PICKUP_FRONT):
    """GREEN(존2)-BLACK(존3) 진열대 위치로 이동. 매개변수 없음."""
    _trace("Zone23() - 존2-3 위치로 이동")
    # TODO
    await wait(100)
    await LineFollow_Deg_Control(50,200,1)
    await LineFollow_color_Control(30,1,True,Color.RED)
    await MoveStraight(60,-70)
    await wait(120)
    await TurnGyro_Control(-90,90)
    await MoveStraight(70,90)
    await wait(100)
    await TurnGyro_Control(90,90)
    await wait(150)
    await ApproachZone(230, drop_side)
    await MoveStraight(110 if drop_side == 'front' else 20,-40)
    # await MoveStraight(20,-40)
    await wait(150)
    pass


async def Zone34(drop_side=PICKUP_FRONT):
    """BLACK(존3)-BLUE(존4) 진열대 위치로 이동. 매개변수 없음."""
    _trace("Zone34() - 존3-4 위치로 이동")
    # TODO
    await wait(100)
    await LineFollow_Deg_Control(50,200,1)
    await LineFollow_color_Control(30,1,True,Color.RED)
    await MoveStraight(60,-70)
    await wait(120)
    await TurnGyro_Control(90,90)
    await MoveStraight(57,90)
    await wait(100)
    await TurnGyro_Control(-92.3,90)
    await wait(150)
    await ApproachZone(210, drop_side)
    await MoveStraight(110 if drop_side == 'front' else 20,-40)
    # await MoveStraight(20,-40)
    await wait(150)

    pass


async def Zone45(drop_side=PICKUP_FRONT):
    """BLUE(존4)-YELLOW(존5) 진열대 위치로 이동. 매개변수 없음."""
    _trace("Zone45() - 존4-5 위치로 이동")
    # TODO
    await wait(100)
    await LineFollow_Deg_Control(50,200,1)
    await LineFollow_color_Control(30,1,True,Color.RED)
    await MoveStraight(60,-70)
    await wait(120)
    await TurnGyro_Control(90,90)
    await MoveStraight(180,90)
    await TurnGyro_Control(-90,90)
    await wait(150)
    await ApproachZone(300, drop_side)
    await MoveStraight(110 if drop_side == 'front' else 20,-40)
    # await MoveStraight(20,-40)

    await wait(150)
    pass


async def Zone56(drop_side=PICKUP_FRONT):
    """왼손=존5(YELLOW), 오른쪽은 바깥/빈 공간 - 짝 존 없음(단독). 매개변수 없음."""
    _trace("Zone56() - 존5 왼손 전용 위치로 이동")
    # TODO: 실측 필요 - 아직 실제 이동 코드 없음
    await wait(100)
    await LineFollow_Deg_Control(50,200,1)
    await LineFollow_color_Control(30,1,True,Color.RED)
    await wait(50)
    await MoveStraight(160,-70)
    await wait(120)
    # await RightArmMove360(210,800)
    await TurnGyro_Control(90,90)
    await MoveStraight(315,90)
    await wait(100)
    await TurnGyro_Control(-90,90)
    await wait(150)
    await ApproachZone(400, drop_side)
    await MoveStraight(110 if drop_side == 'front' else 20,-40)
    # await MoveStraight(20,-40)

    await wait(150)
    pass


ZONE_FUNCS = {
    (0, 1): Zone01, (1, 2): Zone12, (2, 3): Zone23,
    (3, 4): Zone34, (4, 5): Zone45, (5, 6): Zone56,
}


# ----------------------------------------------------------------
# Zone -> Zone 직접 거리 이동 설정
#
# 기존 Zone01~Zone56()은 첫 번째 진입 때 그대로 사용한다.
# 연속 드롭 때만 아래 좌표 차이를 사용하여 중앙을 거치지 않고 이동한다.
#
# 좌표는 기존 ZoneXX() 안의 좌우 실측 이동값을 그대로 옮긴 것이다.
# 낮은 존 방향은 음수, 높은 존 방향은 양수로 표시한다.
#
# 중요: ZoneXX()의 좌우 이동값을 수정하면 아래 좌표도 같은 값으로 맞춰야 한다.
# ----------------------------------------------------------------
ZONE_POSITION_MM = {
    (0, 1): -324,   # Zone01: Turn -90 후 324mm
    (1, 2): -175,   # Zone12: Turn -90 후 190mm
    (2, 3):  -60,   # Zone23: Turn -90 후 55mm
    (3, 4):  48.5,  # Zone34: Turn +90 후 51.5mm
    (4, 5):  180,   # Zone45: Turn +90 후 180mm
    (5, 6):  325,   # Zone56: Turn +90 후 310mm
}


ZONE_TRANSITION_ADJUST_MM = {
    ((0, 1), (3,4)): 20,
    ((0, 1), (4,5)): 26,
    ((0, 1), (5,6)): 13.5,
    ((0, 1), (2,3)): 0,
    ((1, 2), (4,5)): 50,
    ((1, 2), (5,6)): 25,
    ((1, 2), (3,4)): 49,
    ((1, 2), (2,3)): 20,
    ((2, 3), (4,5)): 20,
    ((2, 3), (1,2)): 15,
    ((2, 3), (5,6)): 10,
    ((2, 3), (3,4)): 20,
    ((3, 4), (1,2)): 35,
    ((3, 4), (2,3)): 16.5,
    ((3, 4), (5,6)): -7,
    ((3, 4), (0,1)): 20,
    ((4, 5), (5,6)): -5,
    ((4, 5), (1,2)): 48,
    ((4, 5), (2,3)): 21,
    ((4, 5), (0,1)): 25,
    ((5, 6), (1,2)): 25,
    ((5, 6), (3,4)): -20,
    ((5, 6), (0,1)): 10,
    ((5, 6), (2,3)): 5,

}
# 드롭 위치에서 좌우 이동 통로까지 빠져나오는 거리와,
# 다음 Zone에서 다시 진열대로 들어가는 거리.
ZONE_RETREAT_MM = 150
ZONE_RETREAT_SPEED = -80
ZONE_APPROACH_MM = 280
ZONE_APPROACH_SPEED = 50
ZONE_LATERAL_SPEED = 90
ZONE_TURN_SPEED = 90


def ZonePositionMM(zone_pair):
    """Zone pair에 해당하는 로봇의 좌우 기준 좌표(mm)를 반환한다."""
    if zone_pair not in ZONE_POSITION_MM:
        raise ValueError("정의되지 않은 zone_pair: " + str(zone_pair))
    return ZONE_POSITION_MM[zone_pair]


def ZoneSignedDistanceMM(from_zone, to_zone):
    """현재 Zone 자세에서 다음 Zone 자세까지의 부호 있는 거리(mm)."""
    return ZonePositionMM(to_zone) - ZonePositionMM(from_zone)


def ZoneDistanceMM(from_zone, to_zone):
    """현재 Zone 자세에서 다음 Zone 자세까지의 절대 거리(mm)."""
    return abs(ZoneSignedDistanceMM(from_zone, to_zone))


async def MoveZoneLateral(
    signed_distance_mm,
    from_side=PICKUP_FRONT,
    to_side=PICKUP_FRONT
):
    """
    전면 자세로 진열대 앞 통로에서 옆으로 이동한 뒤 다시 진열대를 바라본다.

    양수: 높은 Zone 번호 방향으로 +90도 회전
    음수: 낮은 Zone 번호 방향으로 -90도 회전
    """
    _check_side(from_side)
    _check_side(to_side)

    if signed_distance_mm == 0:
        return

    turn_angle = 90 if signed_distance_mm > 0 else -90
    enter_turn = turn_angle
    leave_turn = -turn_angle

    await TurnGyro_Control(enter_turn, ZONE_TURN_SPEED)
    await wait(100)
    await MoveStraight(abs(signed_distance_mm), ZONE_LATERAL_SPEED)
    await wait(100)

    # 적재 단계와 관계없이 항상 전면으로 진열대를 바라본다.
    await TurnGyro_Control(leave_turn, ZONE_TURN_SPEED)
    await wait(100)


# async def MoveBetweenZones(from_zone, to_zone):
#     """
#     현재 Zone 통로 위치에서 다음 Zone 통로 위치까지 직접 이동한 뒤,
#     진열대를 바라보고 ZONE_APPROACH_MM만큼 전진한다.
#     """
#     signed_distance = ZoneSignedDistanceMM(from_zone, to_zone)

#     print(
#         "[ZONE 거리이동] " + str(from_zone) + " -> " + str(to_zone)
#         + " / 좌표=" + str(ZonePositionMM(from_zone))
#         + " -> " + str(ZonePositionMM(to_zone)) + "mm"
#         + " / signed=" + str(signed_distance) + "mm"
#         + " / distance=" + str(abs(signed_distance)) + "mm"
#     )

#     await MoveZoneLateral(signed_distance)

#     # MoveZoneLateral() 종료 시 로봇은 진열대를 바라보고 있다.
#     await MoveStraight(ZONE_APPROACH_MM, ZONE_APPROACH_SPEED)
#     await wait(150)
async def MoveBetweenZones(
    from_zone,
    to_zone,
    from_side=PICKUP_FRONT,
    to_side=PICKUP_FRONT
):
    """
    현재 Zone 통로 위치에서 다음 Zone 통로 위치까지 직접 이동한 뒤,
    진열대를 바라보고 ZONE_APPROACH_MM만큼 전진한다.
    """
    _trace("MoveBetweenZones()")
    signed_distance = ZoneSignedDistanceMM(from_zone, to_zone)
    base_distance_mm = abs(signed_distance)

    # ── 구간별 추가 보정 적용 ──
    adjust = ZONE_TRANSITION_ADJUST_MM.get((from_zone, to_zone), 0)
    signed_distance += adjust if signed_distance >= 0 else -adjust

    # 기존 일반 출력문 주석 처리
    # print(
    #     "[ZONE 거리이동] " + str(from_zone) + " -> " + str(to_zone)
    #     + " / 좌표=" + str(ZonePositionMM(from_zone))
    #     + " -> " + str(ZonePositionMM(to_zone)) + "mm"
    #     + " / signed=" + str(signed_distance) + "mm"
    #     + " / distance=" + str(abs(signed_distance)) + "mm"
    #     + " / adjust=" + str(adjust) + "mm"
    # )
    pass

    print(
        "[ZONE 이동 경로]", from_zone, "->>>>>>>", to_zone,
        "/ 기존 거리=" + str(base_distance_mm) + "mm",
        "/ ZONE_TRANSITION_ADJUST_MM=" + ("+" if adjust >= 0 else "") + str(adjust) + "mm",
        "/ 최종 거리=" + str(abs(signed_distance)) + "mm"
    )
    if to_zone == (5, 6):
        await MoveStraight(170, -abs(ZONE_RETREAT_SPEED))

    await MoveZoneLateral(signed_distance, from_side, to_side)
    await MoveStraight((290 if to_side == 'front' else 290)+ (50 if to_zone == (5, 6) else 0), 80 if to_zone == (5, 6) else abs(ZONE_APPROACH_SPEED))
    if to_zone == (5, 6):
        await MoveStraight(150, 30)
    await MoveStraight(105 if to_side == 'front' else 15,-40)
    await wait(150)


# ----------------------------------------------------------------
# 존별 "중앙 복귀" 함수 - Zone 드롭 묶음이 끝난 뒤 검정선 기준 중앙으로 돌아온다.
# 기존 실측 동작은 수정하지 않았으며, 어느 Zone에서 오느냐에 따라 각 함수를 사용한다.
# 연속 Zone 드롭 중에는 실행하지 않고 다음 Pair 이동 또는 전체 종료 때만 실행한다.
# ----------------------------------------------------------------
async def RecenterFromZone01():
    """존1(Zone01) 위치에서 드롭존 중앙으로 복귀. 매개변수 없음."""
    _trace("RecenterFromZone01() - 존1에서 중앙으로 복귀")
    # TODO: 실측 필요 - 후진 거리/각도
    await MoveStraight(350,-80)
    await TurnGyro_Control(90,90)
    await wait(150)
    await MoveStraight_blk_Control(60)
    await MoveStraight(35, 60)
    await TurnGyro_Control(85,90)
    await wait(100)
    pass


async def RecenterFromZone12():
    """존1-2(Zone12) 위치에서 드롭존 중앙으로 복귀. 매개변수 없음."""
    _trace("RecenterFromZone12() - 존1-2에서 중앙으로 복귀")
    # TODO: 실측 필요
    await MoveStraight(350,-80)
    await TurnGyro_Control(90,90)
    await wait(150)
    await MoveStraight_blk_Control(60)
    await MoveStraight(35, 60)
    await TurnGyro_Control(85,90)
    await wait(100)
    pass


async def RecenterFromZone23():
    """존2-3(Zone23) 위치에서 드롭존 중앙으로 복귀. 매개변수 없음."""
    _trace("RecenterFromZone23() - 존2-3에서 중앙으로 복귀")
    # TODO: 실측 필요
    await MoveStraight(350,-80)
    await TurnGyro_Control(90,90)
    await wait(150)
    await MoveStraight(60,-80)
    await MoveStraight_blk_Control(60)
    await MoveStraight(35, 60)
    await TurnGyro_Control(85,90)
    await wait(100)
    pass


async def RecenterFromZone34():
    """존3-4(Zone34) 위치에서 드롭존 중앙으로 복귀. 매개변수 없음."""
    _trace("RecenterFromZone34() - 존3-4에서 중앙으로 복귀")
    # TODO: 실측 필요
    await MoveStraight(350,-80)
    await TurnGyro_Control(-90,90)
    await wait(150)
    await MoveStraight(60,-80)
    await MoveStraight_blk_Control(60)
    await MoveStraight(20, 60)
    await TurnGyro_Control(-85,90)
    await wait(100)
    pass


async def RecenterFromZone45():
    """존4-5(Zone45) 위치에서 드롭존 중앙으로 복귀. 매개변수 없음."""
    _trace("RecenterFromZone45() - 존4-5에서 중앙으로 복귀")
    # TODO: 실측 필요
    await MoveStraight(350,-80)
    await TurnGyro_Control(-90,90)
    await wait(150)
    await MoveStraight_blk_Control(60)
    await MoveStraight(15, 60)
    await TurnGyro_Control(-85,90)
    await wait(100)
    pass

async def RecenterFromZone56():
    """존5(Zone56) 위치에서 드롭존 중앙으로 복귀. 매개변수 없음."""
    _trace("RecenterFromZone56() - 존5에서 중앙으로 복귀")
    # TODO: 실측 필요
    await multitask(
        MoveStraight(350,-80),
        RightArmMove360(300,600)
    )
    await TurnGyro_Control(-90,90)
    await wait(150)
    await MoveStraight_blk_Control(60)
    # await wait(100)
    await MoveStraight(15, 60)
    await wait(100)
    await TurnGyro_Control(-85,90)
    pass


RECENTER_FROM_ZONE = {
    (0, 1): RecenterFromZone01, (1, 2): RecenterFromZone12, (2, 3): RecenterFromZone23,
    (3, 4): RecenterFromZone34, (4, 5): RecenterFromZone45, (5, 6): RecenterFromZone56,
}


# ----------------------------------------------------------------
# 이동 디스패처
#
# 기존 구조는 유지하면서 Zone 간 이동만 다음처럼 변경한다.
#   - 첫 번째 Zone: 기존 ZoneXX() 실행
#   - 다음 Zone: 150mm 후진 후 좌표 차이만큼 직접 이동
#   - 다음 Pair 또는 전체 종료: 기존 RecenterFromZoneXX()로 검정선 중앙 복귀
# ----------------------------------------------------------------
_last_pair = None
_last_pair_side = None
_at_museum = False
_last_zone = None
_last_zone_side = None
_zone_lane_ready = False  # True면 드롭 후 150mm 후진하여 좌우 이동 통로에 있음

def get_last_zone():
    """마지막으로 이동한 Zone 위치를 반환한다."""
    return _last_zone

async def retreat_from_zone_to_lane():
    """적재 단계와 관계없이 후진하여 Zone 간 좌우 이동 통로로 나온다."""
    global _zone_lane_ready

    if _last_zone is None:
        return False

    if _zone_lane_ready:
        return True

    _trace("retreat_from_zone_to_lane()")

    retreat_speed = -abs(ZONE_RETREAT_SPEED)
    direction_text = "후진" if retreat_speed < 0 else "전진"
    # 기존 일반 출력문 주석 처리
    # print(
    #     "[ZONE 통로진입] " + str(_last_zone)
    #     + " / " + direction_text + " " + str(ZONE_RETREAT_MM) + "mm"
    # )
    pass
    await MoveStraight(ZONE_RETREAT_MM, retreat_speed)
    await multitask(
        RightArmMove360(270, 200),
        LeftArmMove360(90, 200)
    )
    await wait(200)
    _zone_lane_ready = True
    return True


async def recenter_from_current_zone(reason=""):
    """
    현재 Zone에서 기존 RecenterFromZoneXX()를 사용해 중앙으로 복귀한다.
    중앙 복귀 방식은 거리 계산이 아니라 기존 검정선 감지 방식 그대로이다.
    """
    global _last_zone, _last_zone_side, _zone_lane_ready

    if _last_zone is None:
        # 기존 일반 출력문 주석 처리
        # print(
        #     "[INFO] recenter_from_current_zone: 이미 중앙이므로 생략"
        #     + (" - " + reason if reason else "")
        # )
        pass
        return True

    recenter_func = RECENTER_FROM_ZONE.get(_last_zone)
    if recenter_func is None:
        # 기존 일반 출력문 주석 처리
        # print(
        #     "[경고] recenter_from_current_zone: 정의되지 않은 존 복귀 함수 - "
        #     + str(_last_zone)
        # )
        pass
        return False

    # 직접 호출된 경우에도 기존 Recenter 함수의 시작 위치를 보장한다.
    await retreat_from_zone_to_lane()

    # 전면 전용 버전에서는 적재 단계가 바뀌어도 차체 방향을 반전하지 않는다.

    # 기존 일반 출력문 주석 처리
    # print(
    #     "[MOVE] Zone" + str(_last_zone) + " -> 검정선 중앙 복귀"
    #     + (" (" + reason + ")" if reason else "")
    # )
    pass
    await recenter_func()
    _last_zone = None
    _last_zone_side = None
    _zone_lane_ready = False
    return True


async def goto_pair(pair_name, pickup_side=PICKUP_FRONT):
    """최초/박물관 복귀 후에는 PairXX(), 연결 이동은 MoveBetweenPairs()."""
    global _last_pair, _last_pair_side, _at_museum, _zone_lane_ready
    _check_side(pickup_side)
    if pair_name not in PAIR_FUNCS or pair_name not in PAIR_POSITION_MM:
        raise ValueError('정의되지 않은 pair_name: ' + str(pair_name))

    if _at_museum:
        if _last_zone is not None:
            if await recenter_from_current_zone("goto_pair 전 안전 복귀") is False:
                raise RuntimeError('pair_museum_recenter_failed')
        await BackToExcavation()
        _at_museum = False
        _zone_lane_ready = False
        _last_pair = None
        _last_pair_side = None

    if _last_pair is None:
        await PAIR_FUNCS[pair_name](pickup_side)
    elif _last_pair != pair_name:
        await MoveBetweenPairs(_last_pair, pair_name, _last_pair_side, pickup_side)
    # 같은 Pair는 이동 생략. 이동에 실패하면 아래 위치 갱신까지 진행하지 않는다.
    _last_pair = pair_name
    _last_pair_side = pickup_side


async def goto_zone(zone_pair, drop_side=PICKUP_FRONT):
    """
    지정한 Zone 자세로 이동한다.

    첫 번째 Zone은 기존 ZoneXX() 전체 경로를 그대로 실행한다.
    연속된 다음 Zone은 중앙으로 돌아가지 않고 실측 좌표 차이만큼 직접 이동한다.
    """
    global _at_museum, _last_zone, _last_zone_side, _zone_lane_ready
    _check_side(drop_side)

    if not _at_museum:
        transition = GOTO_MUSEUM_FROM_PAIR.get(_last_pair)
        if transition:
            await transition(_last_pair_side)
        _at_museum = True
        _last_zone = None
        _last_zone_side = None
        _zone_lane_ready = False

    # 첫 번째 Zone 또는 중앙 복귀 후 새 Zone 진입: 기존 함수 그대로 사용
    if _last_zone is None:
        await ZONE_FUNCS[zone_pair](drop_side)
        _last_zone = zone_pair
        _last_zone_side = drop_side
        _zone_lane_ready = False
        return

    # 같은 Zone 자세로 다시 들어갈 때는 좌우 이동 없이 진열대로 재진입
    if _last_zone == zone_pair:
        if _zone_lane_ready:
            await MoveZoneLateral(0, _last_zone_side, drop_side)
            await MoveStraight(ZONE_APPROACH_MM, abs(ZONE_APPROACH_SPEED))
            await wait(150)
            _zone_lane_ready = False
            _last_zone_side = drop_side
        return

    # 다른 Zone: 현재 통로 위치에서 좌표 차이만큼 직접 이동
    await retreat_from_zone_to_lane()


    from_zone = _last_zone
    from_side = _last_zone_side

    # 다음 목적지가 Zone56이면 50mm 추가 후진
    # print(zone_pair)
    # if zone_pair == (5, 6):
    #     await MoveStraight(250, -60)
# *************추가해야 할 내용***************
    # if zone_pair == (5, 6) and not arm_has_cargo('R'):
    #     await multitask(
    #         MoveStraight(50,-80),
    #         RightArmMove360(210,800)
    #     )
    #     await wait(100)


    await MoveBetweenZones(from_zone, zone_pair, from_side, drop_side)
    _last_zone = zone_pair
    _last_zone_side = drop_side
    _zone_lane_ready = False


_ZONE_PAIR_FUNCS = {
    (1, 2): Zone12,
    (2, 3): Zone23,
    (3, 4): Zone34,
    (4, 5): Zone45,










}


async def GoToMuseum(right_zones, left_zones):
    """
    right_zones / left_zones: 그 순간 오른팔/왼팔이 들고 있는 유물들의 드롭존 번호 리스트.
    두 팔이 담당하는 존을 합쳐서 어느 진열대 위치(ZoneXY)로 가야 하는지 결정한다.
    """
    _trace("GoToMuseum() - 박물관으로 이동")
    all_zones = sorted(set(right_zones) | set(left_zones))
    # 기존 일반 출력문 주석 처리
    # print("   -> 목표 존:", all_zones)
    pass

    if len(all_zones) == 0:
        # 기존 일반 출력문 주석 처리
        # print("[경고] 들고 있는 유물이 없습니다.")
        pass
        return

    if len(all_zones) == 1:
        # 유물 1개뿐 -> 그 존이 포함된 인접 쌍 중 존재하는 쪽 사용
        z = all_zones[0]
        pair = (z, z + 1) if (z, z + 1) in _ZONE_PAIR_FUNCS else (z - 1, z)
    elif len(all_zones) == 2 and all_zones[1] - all_zones[0] == 1:
        pair = (all_zones[0], all_zones[1])
    else:
        # !! 아직 해결 안 됨 - CASE1처럼 존이 3개 이상이거나 떨어져 있으면
        #    한 번의 정차로 갈 수 있는 위치가 없음. 사용자 확인 후 설계 필요.
        # 기존 일반 출력문 주석 처리
        # print("[경고] GoToMuseum: 한 번에 갈 수 없는 존 조합 - all_zones=" + str(all_zones))
        pass
        pair = (all_zones[0], all_zones[0] + 1)

    move_func = _ZONE_PAIR_FUNCS.get(pair)
    if move_func:
        await move_func()
    else:
        # 기존 일반 출력문 주석 처리
        # print("[오류] 정의되지 않은 존 쌍: " + str(pair))
        pass


async def BackToExcavation():
    """다시 발굴 구역으로 복귀. 매개변수 없음."""
    _trace("BackToExcavation() - 발굴 구역으로 복귀")
    # TODO
    # await TurnGyro_Control(180)
    await wait(100)
    # await MoveStraight (400,90)
    pass


async def deliver_all(right_zones, left_zones):
    """드롭 방향이 DIRECT로 판단된 경우 공통으로 사용"""
    _trace("deliver_all() - 드롭 시작 (direct)")
    await GoToMuseum(right_zones, left_zones)
    # TODO: 실제 드롭 동작 (both_drop / r_drop / l_drop 등) 채우기
    # 드롭까지 끝나면 다시 발굴 구역으로
    await MoveStraight(230,50)
    await wait(200)
    await multitask(
        RightArmMove360(290, 800),
        LeftArmMove360(70, 800)
    )
    await MoveStraight(330,-70)

    await BackToExcavation()


async def deliver_cross_swapped(right_zones, left_zones):
    """
    드롭 방향이 CROSS로 판단된 경우 공통으로 사용 (어떤 케이스든 해당 가능).
    !! ASSUMPTION - 실제 로봇으로 검증 필요 !!
    아래 중 실제로 되는 방식으로 TODO를 채워야 함:
      (a) GoToMuseum과 반대 방향으로 회전해서 접근 (팔-존 배치가 자동으로 맞음)
      (b) 접근은 그대로 하되, 드롭을 순서 바꿔서(왼팔 먼저 -> 오른팔) 처리
      (c) 아예 동시 드롭을 포기하고 한쪽씩 따로 드롭
    """
    _trace("deliver_cross_swapped() - 드롭 시작 (cross, 방식 미확정)")
    await GoToMuseum(right_zones, left_zones)
    # TODO: 위 (a)/(b)/(c) 중 실제로 맞는 방식으로 채우기
    await TurnGyro_Control(30,90)
    await MoveStraight(180,70)
    await LeftArmMove360(70, 800)
    await wait(100)
    await MoveStraight(180,-70)
    await TurnGyro_Control(-30,90)
    await wait(100)
    await TurnGyro_Control(-30,90)
    await MoveStraight(180,70)
    await RightArmMove360(290, 500)
    await MoveStraight(150,-70)

    #await BackToExcavation()


# ----------------------------------------------------------------
# 케이스 판별 (픽업 방식만 결정 - 하드웨어로 고정된 팔 조합 기준)
# ----------------------------------------------------------------
def decide_case(colors):
    """
    colors = {1: 슬롯1 색상ID, 2: 슬롯2 색상ID, 3: 슬롯3 색상ID, 4: 슬롯4 색상ID}

    각 Pair 위치에서: 낮은 슬롯 번호 = 오른팔, 높은 슬롯 번호 = 왼팔
      Pair12: 슬롯1(오른팔) - 슬롯2(왼팔)
      Pair23: 슬롯2(오른팔) - 슬롯3(왼팔)
      Pair34: 슬롯3(오른팔) - 슬롯4(왼팔)

    CASE2(Pair23을 먼저 방문)는 "정차 횟수는 줄지만, 남은 슬롯1·4가
    진열대 양 끝으로 흩어질 위험"이 있으므로, 남은 두 존이 실제로
    가까울 때(REMAINING_SPAN_LIMIT 이하)만 선택하도록 제한한다.
    (전체 120가지 배치 조합으로 검증 완료 - span>=3인 CASE2는 0건)
    """
    z = {slot: DROP_ZONE[c] for slot, c in colors.items()}

    pair12_ok = abs(z[1] - z[2]) == 1   # 슬롯1-2(Pair12) 드롭존 인접?
    pair34_ok = abs(z[3] - z[4]) == 1   # 슬롯3-4(Pair34) 드롭존 인접?
    pair23_ok = abs(z[2] - z[3]) == 1   # 슬롯2-3(Pair23) 드롭존 인접?

    if pair12_ok and pair34_ok:
        # 기존 일반 출력문 주석 처리
        # print("[픽업 판단] pair12=True pair34=True -> CASE1")
        pass
        return "CASE1"

    if pair23_ok:
        remaining_span = abs(z[1] - z[4])
        # 기존 일반 출력문 주석 처리
        # print("[픽업 판단] pair23=True, 남은 슬롯1·4 존 간격=" + str(remaining_span))
        pass
        if remaining_span <= REMAINING_SPAN_LIMIT:
            return "CASE2"
        # 기존 일반 출력문 주석 처리
        # print("   -> 간격이 너무 넓어 CASE2 대신 자연 순서(CASE3) 사용")
        pass

    # 기존 일반 출력문 주석 처리
    # print("[픽업 판단] pair12=" + str(pair12_ok)
    #       + " pair34=" + str(pair34_ok)
    #       + " pair23=" + str(pair23_ok) + " -> CASE3(자연 순서)")
    pass
    return "CASE3"


# ----------------------------------------------------------------
# 드롭 방향 판별 - 팔과 팔 사이 (픽업 케이스와 무관 - 드롭 순간마다 매번 확인)
# !! ASSUMPTION - "왼팔에는 낮은 존이 들어가야 정상(DIRECT)"이라고 가정.
#    실제 로봇에서 GoToMuseum() 접근 방향 확인 후 검증 필요 !!
# ----------------------------------------------------------------
def decide_drop_direction(right_zones, left_zones):
    """
    right_zones / left_zones: 오른팔 / 왼팔이 그 순간 들고 있는 유물들의 드롭존 번호 리스트
    한쪽 팔만 사용 중이면(리스트가 비어있으면) 교차 문제 자체가 없으므로 DIRECT
    """
    if not right_zones or not left_zones:
        return "DIRECT"

    if max(left_zones) < min(right_zones):
        return "DIRECT"    # 왼팔 존이 전부 오른팔보다 낮음 -> 정상 배치
    if max(right_zones) < min(left_zones):
        return "CROSS"     # 반대 -> 교차 필요

    # 이론상 두 팔이 담당하는 존은 항상 분리되어 겹치지 않아야 함(연속 슬롯 = 연속 존).
    # 겹치는 경우가 실제로 나오면 가정 자체를 재검토해야 함 -> 안전하게 DIRECT로 두고 로그로 표시
    # 기존 일반 출력문 주석 처리
    # print("[경고] 드롭존이 겹치는 예상 밖의 상황 - right=" + str(right_zones) + " left=" + str(left_zones))
    pass
    return "DIRECT"


# ----------------------------------------------------------------
# 드롭 순서 판별 - 같은 팔 안에서 (한 팔이 2개를 순서대로 집었을 때)
# !! ASSUMPTION - "먼저 집힌 게 낮은 존으로 가야 정상(DIRECT)"이라고 가정.
#    실제 로봇 테스트로 검증 필요 !!
# ----------------------------------------------------------------
def decide_same_arm_order(zone_first, zone_second):
    """
    zone_first  : 그 팔이 먼저 집은 유물의 드롭존 번호 (예: 슬롯1)
    zone_second : 그 팔이 나중에 집은 유물의 드롭존 번호 (예: 슬롯2)
    """
    if zone_first < zone_second:
        return "DIRECT"
    else:
        return "CROSS"


CROSS_TURN_ANGLE = 90   # TODO: 실측 - 좌/우로 회전해서 반대쪽 존에 닿는 각도


async def deliver_same_arm(arm, zone_first, zone_second):
    """
    한쪽 팔이 순서대로 집은 유물 2개를 배달한다 (다른 쪽 팔은 비어있는 상태).
    arm: 'R' 또는 'L'
    zone_first  : 먼저 집힌 유물의 드롭존 번호
    zone_second : 나중에 집힌 유물의 드롭존 번호

    DIRECT: 그대로 도착 위치에서 stage1 -> stage2 순서로 놓으면 순서가 맞음
    CROSS : 순서가 반대라서, 로봇을 회전해 먼저 집힌 것부터 반대쪽에 놓고 원위치,
            다시 반대로 돌아 나머지를 놓고 원위치해야 함
    """
    _trace("deliver_same_arm() - " + arm + "팔 단독 2개 배달")

    if arm == 'R':
        await GoToMuseum([zone_first, zone_second], [])
        drop_stage1 = r_drop_stage1
        drop_stage2 = r_drop_stage2
    else:
        await GoToMuseum([], [zone_first, zone_second])
        drop_stage1 = l_drop_stage1
        drop_stage2 = l_drop_stage2

    order = decide_same_arm_order(zone_first, zone_second)
    # 기존 일반 출력문 주석 처리
    # print("[같은팔 순서 판단] arm=" + arm
    #       + " first=" + str(zone_first)
    #       + " second=" + str(zone_second)
    #       + " -> " + order)
    pass

    if order == "DIRECT":
        await drop_stage1()
        await drop_stage2()
    else:
        # 순서가 반대 -> 회전해서 먼저 집힌 것부터 반대쪽에 놓고 원위치,
        # 다시 반대로 돌아 나머지 마저 놓고 원위치
        await TurnGyro_Control(-CROSS_TURN_ANGLE)
        await drop_stage1()
        await TurnGyro_Control(CROSS_TURN_ANGLE)

        await TurnGyro_Control(CROSS_TURN_ANGLE)
        await drop_stage2()
        await TurnGyro_Control(-CROSS_TURN_ANGLE)

    await BackToExcavation()


async def deliver_smart(right_zones, left_zones):
    """
    그 순간 양팔이 들고 있는 존을 보고 배달 방식을 자동으로 결정한다.

    0) 한쪽 팔만 2개를 순서대로 들고 있는 경우(같은 팔 문제)
       -> deliver_same_arm()으로 위임
    1) 오른팔+왼팔 존을 합쳐서 "존 1개" 또는 "인접한 존 2개"로 정리되면
       -> 한 번의 정차로 direct/cross 판단해서 동시 배달
    2) 그렇지 않으면(예: 존1과 존4처럼 멀리 떨어짐, 또는 CASE1처럼 존이 4개)
       -> 오른팔 것 먼저 배달 -> 발굴구역 복귀 없이 이어서 왼팔 것 배달
          (한 번에 갈 수 없는 위치이므로 나눠서 감)
    """
    if right_zones and not left_zones and len(right_zones) == 2:
        await deliver_same_arm('R', right_zones[0], right_zones[1])
        return
    if left_zones and not right_zones and len(left_zones) == 2:
        await deliver_same_arm('L', left_zones[0], left_zones[1])
        return

    all_zones = sorted(set(right_zones) | set(left_zones))
    can_combine = (
        len(all_zones) <= 1
        or (len(all_zones) == 2 and all_zones[1] - all_zones[0] == 1)
    )

    if can_combine:
        direction = decide_drop_direction(right_zones, left_zones)
        # 기존 일반 출력문 주석 처리
        # print("[드롭 판단] right_zones=" + str(right_zones)
        #       + " left_zones=" + str(left_zones)
        #       + " -> " + direction + " (동시 배달)")
        pass
        if direction == "DIRECT":
            await deliver_all(right_zones, left_zones)
        else:
            await deliver_cross_swapped(right_zones, left_zones)
    else:
        # 기존 일반 출력문 주석 처리
        # print("[드롭 판단] right_zones=" + str(right_zones)
        #       + " left_zones=" + str(left_zones)
        #       + " -> 한번에 갈 수 없음, 분할 배달 (오른팔 먼저 -> 왼팔)")
        pass
        if right_zones:
            await deliver_all(right_zones, [])
        if left_zones:
            await deliver_all([], left_zones)


# ================================================================
# 12. 신규 - 상태 기반 pick/drop planner (WRO_lib_34.py 리팩터링)
# ================================================================

# ----------------------------------------------------------------
# Pair / Zone 매핑 테이블
# ----------------------------------------------------------------
PAIR_HAND_SLOT = {
    'Pair01': {'L': 1},
    'Pair12': {'R': 1, 'L': 2},
    'Pair23': {'R': 2, 'L': 3},
    'Pair34': {'R': 3, 'L': 4},
    'Pair45': {'R': 4},
}

SLOT_HAND_TO_PAIR = {}
for _pair, _mapping in PAIR_HAND_SLOT.items():
    for _hand, _slot in _mapping.items():
        SLOT_HAND_TO_PAIR[(_slot, _hand)] = _pair

# 더블 Pair(12/23/34)에서 한쪽 손으로 집을 때, 짝(companion) 슬롯이 뭔지.
# Pair01/45는 짝이 없는 "싱글" 위치라 여기 등록 안 함(=항상 안전).
PAIR_COMPANION_SLOT = {
    ('Pair12', 'R'): 2, ('Pair12', 'L'): 1,
    ('Pair23', 'R'): 3, ('Pair23', 'L'): 2,
    ('Pair34', 'R'): 4, ('Pair34', 'L'): 3,
}

ZONE_HAND_ZONE = {
    'Zone01': {'R': 1},
    'Zone12': {'L': 1, 'R': 2},
    'Zone23': {'L': 2, 'R': 3},
    'Zone34': {'L': 3, 'R': 4},
    'Zone45': {'L': 4, 'R': 5},
    'Zone56': {'L': 5},
}


def zone_pair_for_hand(hand, zone):
    """오른손 존z -> (z-1,z) / 왼손 존z -> (z,z+1)"""
    return (zone - 1, zone) if hand == 'R' else (zone, zone + 1)


def is_zone_safe(zone_pair, filled_zones):
    """
    zone_pair: (0,1)~(5,6) 중 하나. 0과 6은 바깥/빈 공간이라 검사 제외.
    filled_zones에 zone_pair 안의 실제 존이 있으면 False(위험).
    """
    for z in zone_pair:
        if z in (0, 6):
            continue
        if z in filled_zones:
            return False
    return True


# ----------------------------------------------------------------
# 실행 중 상태 - 각 실제 팔의 첫 번째/두 번째 적재물을 별도로 추적
# ----------------------------------------------------------------
cargo = {
    PICKUP_FRONT: {'R': None, 'L': None},
    PICKUP_REAR: {'R': None, 'L': None},
}
# 이전 참고용 함수와 로그의 호환성을 위한 첫 번째 적재 단계 별칭.
hands = cargo[PICKUP_FRONT]
filled_zones = set()                 # 이미 놓인 존들
remaining_slots = set()              # 아직 안 집은 슬롯
colors_ref = {}                      # 이번 미션의 colors 딕셔너리 (pick_slot 등에서 참조)
partially_unloaded_arms = set()       # 첫 유물만 부분 드롭한 실제 팔


def reset_pickup_state(colors):
    global cargo, hands, filled_zones, remaining_slots, colors_ref
    global partially_unloaded_arms
    global _last_pair, _last_pair_side, _at_museum
    global _last_zone, _last_zone_side, _zone_lane_ready
    cargo = {
        PICKUP_FRONT: {'R': None, 'L': None},
        PICKUP_REAR: {'R': None, 'L': None},
    }
    hands = cargo[PICKUP_FRONT]
    filled_zones = set()
    remaining_slots = {1, 2, 3, 4}
    colors_ref = dict(colors)
    partially_unloaded_arms = set()
    _last_pair = None
    _last_pair_side = None
    _at_museum = False
    _last_zone = None
    _last_zone_side = None
    _zone_lane_ready = False


def arm_has_cargo(hand):
    """해당 팔의 첫 번째/두 번째 적재 공간 중 하나라도 차 있으면 True."""
    return (cargo[PICKUP_FRONT][hand] is not None
            or cargo[PICKUP_REAR][hand] is not None)


def cargo_is_empty():
    """양팔의 첫 번째/두 번째 적재 위치가 모두 비었는지 확인한다."""
    return all(
        cargo[side][hand] is None
        for side in (PICKUP_FRONT, PICKUP_REAR)
        for hand in ('R', 'L')
    )


def state_str():
    """[STATE] 로그용 - 현재 상태를 한 줄 문자열로 요약"""
    return ("cargo={first:" + str(cargo[PICKUP_FRONT])
            + ", second:" + str(cargo[PICKUP_REAR]) + "}"
            + "  remaining=" + str(remaining_slots)
            + "  filled=" + str(filled_zones))


# ----------------------------------------------------------------
# pick_slot / pick_pair - 실제 로봇 픽업 실행 + 상태 갱신
# ----------------------------------------------------------------
async def pick_slot(slot, hand, pickup_side=PICKUP_FRONT):
    """단일 슬롯 픽업: 해당 Pair로 이동 후 한 손만 그랩, 상태 갱신"""
    global cargo, remaining_slots
    _check_side(pickup_side)
    side_hands = cargo[pickup_side]
    if side_hands[hand] is not None:
        # 기존 일반 출력문 주석 처리
        # print("[경고] pick_slot: " + pickup_side + " " + hand
        #       + " 적재 위치가 이미 차있습니다 - 실행 안 함")
        pass
        return False
    pair_name = SLOT_HAND_TO_PAIR.get((slot, hand))
    color = colors_ref.get(slot, UNKNOWN_COLOR)
    if pair_name is None or color not in DROP_ZONE:
        # 기존 일반 출력문 주석 처리
        # print("[오류] pick_slot: 슬롯/손/색상 정보가 안전하지 않습니다 - 실행 안 함")
        pass
        return False
    await goto_pair(pair_name, pickup_side)
    await grab_hand(hand, pickup_side)
    zone = DROP_ZONE[color]
    side_hands[hand] = (slot, color, zone)
    remaining_slots.discard(slot)
    # 기존 일반 출력문 주석 처리
    # print("  [STATE] " + state_str())
    pass
    return True


async def pick_pair_action(
    pair_name,
    r_slot,
    l_slot,
    pickup_side=PICKUP_FRONT
):
    """짝 슬롯 동시 픽업: 양손 동시 그랩, 상태 갱신"""
    global cargo, remaining_slots
    _check_side(pickup_side)
    side_hands = cargo[pickup_side]
    r_color = colors_ref.get(r_slot, UNKNOWN_COLOR)
    l_color = colors_ref.get(l_slot, UNKNOWN_COLOR)
    if side_hands['R'] is not None or side_hands['L'] is not None:
        # 기존 일반 출력문 주석 처리
        # print("[오류] pick_pair: " + pickup_side
        #       + " 양손 중 하나가 이미 차있습니다 - 실행 안 함")
        pass
        return False
    if r_color not in DROP_ZONE or l_color not in DROP_ZONE:
        # 기존 일반 출력문 주석 처리
        # print("[오류] pick_pair: 안전하지 않은 색상 정보 - 실행 안 함")
        pass
        return False
    await goto_pair(pair_name, pickup_side)
    await grab_both(pickup_side)
    side_hands['R'] = (r_slot, r_color, DROP_ZONE[r_color])
    side_hands['L'] = (l_slot, l_color, DROP_ZONE[l_color])
    remaining_slots.discard(r_slot)
    remaining_slots.discard(l_slot)
    # 기존 일반 출력문 주석 처리
    # print("  [STATE] " + state_str())
    pass
    return True


# ----------------------------------------------------------------
# drop_hand / drop_both_if_direct - 실제 로봇 드롭 실행 + 상태 갱신
# ----------------------------------------------------------------
async def drop_hand(hand, pickup_side=PICKUP_FRONT, drop_reversed=None):
    """
    한쪽 손만 드롭한다.

    실행 세트:
      1) 해당 Zone으로 이동
      2) 해당 손 드롭
      3) 기존과 동일하게 150mm 후진
      4) 다음 드롭이면 Zone 간 직접 거리 이동
      5) 다음 Pair 또는 전체 종료 시 검정선 중앙 복귀
    """
    global cargo, filled_zones
    _check_side(pickup_side)
    side_hands = cargo[pickup_side]
    if side_hands[hand] is None:
        # 기존 일반 출력문 주석 처리
        # print("[경고] drop_hand: " + pickup_side + " " + hand
        #       + " 적재 위치가 비어있습니다 - 실행 안 함")
        pass
        return False
    item = side_hands[hand]
    zone = item[2]
    zp = zone_pair_for_hand(hand, zone)
    if not is_zone_safe(zp, filled_zones):
        # 기존 일반 출력문 주석 처리
        # print("[경고] drop_hand: zone_pair" + str(zp) + " 위험 - 실행 안 함")
        pass
        return False

    await goto_zone(zp, pickup_side)

    await drop_hand_for_side(hand, pickup_side, drop_reversed)

    # 기존의 드롭 후 150mm 후진 동작은 그대로 유지한다.
    await retreat_from_zone_to_lane()

    filled_zones.add(zone)
    side_hands[hand] = None

    # 기존 일반 출력문 주석 처리
    # print("  [STATE] " + state_str())
    pass
    return True


async def drop_both_if_direct(pickup_side=PICKUP_FRONT, drop_reversed=None):
    """
    양손 동시 드롭.

    DIRECT 조건(왼손 zone+1 == 오른손 zone)일 때만 실행한다.
    드롭 후 기존과 동일하게 150mm 후진하고, 중앙 복귀는 다음 Pair 또는 종료 때 수다.
    """
    global cargo, filled_zones
    _check_side(pickup_side)
    side_hands = cargo[pickup_side]
    if side_hands['R'] is None or side_hands['L'] is None:
        # 기존 일반 출력문 주석 처리
        # print("[경고] drop_both_if_direct: " + pickup_side
        #       + " 양손이 다 차있지 않습니다 - 실행 안 함")
        pass
        return False
    l_zone = side_hands['L'][2]
    r_zone = side_hands['R'][2]
    if r_zone != l_zone + 1:
        # 기존 일반 출력문 주석 처리
        # print("[경고] drop_both_if_direct: DIRECT 조건이 아닙니다 - 실행 안 함")
        pass
        return False
    zp = (l_zone, r_zone)
    if not is_zone_safe(zp, filled_zones):
        # 기존 일반 출력문 주석 처리
        # print("[경고] drop_both_if_direct: zone_pair" + str(zp) + " 위험 - 실행 안 함")
        pass
        return False

    await goto_zone(zp, pickup_side)
    await both_drop(pickup_side, drop_reversed)

    # 기존의 드롭 후 150mm 후진 동작은 그대로 유지한다.
    await retreat_from_zone_to_lane()

    filled_zones.add(l_zone)
    filled_zones.add(r_zone)
    side_hands['R'] = None
    side_hands['L'] = None

    # 기존 일반 출력문 주석 처리
    # print("  [STATE] " + state_str())
    pass
    return True


# ----------------------------------------------------------------
# planner (순수 로직 - 로봇 호출 없음, 컴퓨터에서 바로 테스트 가능)
#
# v40 변경점: "unloading" 상태 추가
#   - 이번에 손에 든 걸 아직 하나도 안 내려놓았으면(unloading=False):
#     남은 손도 채우는 pick을 허용한다 (예: Pair23 집고 -> 바로 Pair45도 집기)
#   - 한 번이라도 내려놓았으면(unloading=True):
#     새 pick 후보를 만들지 않고, 마저 다 비우는 것만 허용한다
#     (예전 크래시 버그 재발 방지 - 반쯤 내려놓은 채로 새 Pair 방문 금지)
# ----------------------------------------------------------------
def _generate_actions_safe(
    remaining, hnd, filled, unloading=False, preferred_slots=None, colors=None
):
    """
    행동 후보를 우선순위 순서로 생성한다.

      1) 양손 다 찼으면      -> drop만 가능 (drop_both 우선)
      2) 한쪽만 찼고 아직 드롭을 안 했으면(unloading=False)
                              -> 남은 손 채우는 pick 후보 먼저, 그 다음 drop 후보
      3) 한쪽만 찼는데 이미 드롭을 했으면(unloading=True)
                              -> drop만 가능 (새 pick 금지)
      4) 양손 다 비었으면     -> pick만 가능 (pick_pair 우선)
    """
    both_full = hnd['R'] is not None and hnd['L'] is not None
    both_empty = hnd['R'] is None and hnd['L'] is None

    if both_full:
        actions = []
        l_zone = hnd['L'][2]
        r_zone = hnd['R'][2]
        if r_zone == l_zone + 1:
            zp = (l_zone, r_zone)
            if is_zone_safe(zp, filled):
                actions.append(('drop_both',))
        for hd in ('R', 'L'):
            zone = hnd[hd][2]
            zp = zone_pair_for_hand(hd, zone)
            if is_zone_safe(zp, filled):
                actions.append(('drop', hd))
        return actions

    if not both_empty:
        occupied_hand = 'R' if hnd['R'] is not None else 'L'
        actions = []

        if not unloading:
            # 아직 이번 묶음에서 드롭을 시작 안 했으면 -> 남은 손 채우는 pick 후보를 먼저 시도
            free_hand = 'L' if occupied_hand == 'R' else 'R'
            candidate_picks = []
            for slot in sorted(remaining):
                if (slot, free_hand) not in SLOT_HAND_TO_PAIR:
                    continue
                pair_name = SLOT_HAND_TO_PAIR[(slot, free_hand)]
                companion = PAIR_COMPANION_SLOT.get((pair_name, free_hand))
                if companion is None or companion not in remaining:
                    candidate_picks.append(('pick', slot, free_hand))

            if preferred_slots is not None:
                def fill_priority(action):
                    slot = action[1]
                    known_priority = 0 if slot in preferred_slots else 1
                    if colors is None:
                        return (known_priority, 1)
                    new_zone = DROP_ZONE[colors[slot]]
                    old_zone = hnd[occupied_hand][2]
                    l_zone = new_zone if free_hand == 'L' else old_zone
                    r_zone = new_zone if free_hand == 'R' else old_zone
                    direct_priority = 0 if r_zone == l_zone + 1 else 1
                    return (known_priority, direct_priority)

                candidate_picks.sort(key=fill_priority)
            actions.extend(candidate_picks)

        zone = hnd[occupied_hand][2]
        zp = zone_pair_for_hand(occupied_hand, zone)
        if is_zone_safe(zp, filled):
            actions.append(('drop', occupied_hand))

        return actions

    # 양손 다 비었음 -> pick 후보만 생성 (pick_pair 우선)
    pair_actions = []
    for pair_name, mapping in (('Pair12', {'R': 1, 'L': 2}),
                                ('Pair23', {'R': 2, 'L': 3}),
                                ('Pair34', {'R': 3, 'L': 4})):
        r_slot = mapping['R']
        l_slot = mapping['L']
        if r_slot in remaining and l_slot in remaining:
            pair_actions.append(('pick_pair', pair_name, r_slot, l_slot))

    single_actions = []
    for slot in sorted(remaining):
        for hd in ('R', 'L'):
            if (slot, hd) not in SLOT_HAND_TO_PAIR:
                continue
            pair_name = SLOT_HAND_TO_PAIR[(slot, hd)]
            companion = PAIR_COMPANION_SLOT.get((pair_name, hd))
            if companion is None or companion not in remaining:
                single_actions.append(('pick', slot, hd))

    actions = pair_actions + single_actions

    # 복구 계획에서는 정상 인식된 슬롯이 많이 포함된 픽업을 먼저 시도한다.
    # preferred_slots가 None인 정상 경로는 기존 Pair12→Pair23→Pair34 우선순위를 그대로 유지한다.
    if preferred_slots is not None:
        def preferred_count(action):
            if action[0] == 'pick_pair':
                return ((1 if action[2] in preferred_slots else 0)
                        + (1 if action[3] in preferred_slots else 0))
            return 1 if action[1] in preferred_slots else 0

        def recovery_pick_priority(action):
            direct_priority = 1
            if action[0] == 'pick_pair' and colors is not None:
                r_zone = DROP_ZONE[colors[action[2]]]
                l_zone = DROP_ZONE[colors[action[3]]]
                direct_priority = 0 if r_zone == l_zone + 1 else 1
            return (-preferred_count(action), direct_priority)

        actions.sort(key=recovery_pick_priority)

    return actions


def _apply_action_safe(action, remaining, hnd, filled, colors, unloading=False):
    remaining = set(remaining)
    hnd = dict(hnd)
    filled = set(filled)

    if action[0] == 'pick':
        _, slot, hd = action
        color = colors[slot]
        zone = DROP_ZONE[color]
        hnd[hd] = (slot, color, zone)
        remaining.discard(slot)
    elif action[0] == 'pick_pair':
        _, pair_name, r_slot, l_slot = action
        hnd['R'] = (r_slot, colors[r_slot], DROP_ZONE[colors[r_slot]])
        hnd['L'] = (l_slot, colors[l_slot], DROP_ZONE[colors[l_slot]])
        remaining.discard(r_slot)
        remaining.discard(l_slot)
    elif action[0] == 'drop':
        _, hd = action
        zone = hnd[hd][2]
        filled.add(zone)
        hnd[hd] = None
        unloading = True
    elif action[0] == 'drop_both':
        for hd in ('R', 'L'):
            filled.add(hnd[hd][2])
            hnd[hd] = None
        unloading = False

    if hnd['R'] is None and hnd['L'] is None:
        unloading = False

    return remaining, hnd, filled, unloading


def _is_goal(remaining, hnd):
    return not remaining and hnd['R'] is None and hnd['L'] is None


def _pickup_plan_priority(
    action_list,
    initial_hands,
    preferred_slots=None,
    include_first_pick_priority=False,
):
    """
    계획 비교용 우선순위를 계산한다.

    1) 발굴 구역에서 새로 출발하는 수집 묶음 수를 줄인다.
    2) 횟수가 같으면 첫 수집 묶음에 정상 인식 슬롯이 더 많이 포함된 경로를 우선한다.
    3) 그다음 정상 인식 유물끼리의 동시 드롭을 우선한다.
    4) 마지막으로 전체 동시 드롭 횟수를 우선한다.

    action 수를 비교 기준에 넣지 않아, 수집 횟수가 같은 기존 경로는 그대로 유지한다.
    """
    preferred = set(preferred_slots) if preferred_slots is not None else set()
    held = {
        'R': initial_hands['R'][0] if initial_hands['R'] is not None else None,
        'L': initial_hands['L'][0] if initial_hands['L'] is not None else None,
    }
    in_batch = held['R'] is not None or held['L'] is not None
    pickup_batches = 0
    known_pair_drops = 0
    simultaneous_drops = 0
    known_in_batch = sum(
        1 for slot in (held['R'], held['L']) if slot in preferred
    )
    first_batch_known_count = None

    for action in action_list:
        if action[0] == 'pick':
            _, slot, hand = action
            if not in_batch:
                in_batch = True
                known_in_batch = 0
                pickup_batches += 1
            held[hand] = slot
            if slot in preferred:
                known_in_batch += 1

        elif action[0] == 'pick_pair':
            _, pair_name, r_slot, l_slot = action
            if not in_batch:
                in_batch = True
                known_in_batch = 0
                pickup_batches += 1
            held['R'] = r_slot
            held['L'] = l_slot
            known_in_batch += (
                (1 if r_slot in preferred else 0)
                + (1 if l_slot in preferred else 0)
            )

        elif action[0] == 'drop':
            held[action[1]] = None

        elif action[0] == 'drop_both':
            simultaneous_drops += 1
            if held['R'] in preferred and held['L'] in preferred:
                known_pair_drops += 1
            held['R'] = None
            held['L'] = None

        if in_batch and held['R'] is None and held['L'] is None:
            if first_batch_known_count is None:
                first_batch_known_count = known_in_batch
            in_batch = False
            known_in_batch = 0

    if in_batch and first_batch_known_count is None:
        first_batch_known_count = known_in_batch

    # 정상 배치에서는 기존 후보 순서를 건드리지 않고 수집 횟수만 비교한다.
    if preferred_slots is None:
        return (pickup_batches,)

    first_priority = (
        -(first_batch_known_count or 0)
        if include_first_pick_priority else 0
    )
    return (
        pickup_batches,
        first_priority,
        -known_pair_drops,
        -simultaneous_drops,
    )

def plan_pickup(colors, max_depth=20, preferred_slots=None):
    """
    colors = {1: 색상ID, 2: 색상ID, 3: 색상ID, 4: 색상ID}

    모든 안전한 완성 경로를 상태별로 비교해 최적 경로를 반환한다.
    복구 계획의 정상 인식 우선 정책을 지키면서 수집 출발 횟수를 최소화하고,
    우선순위가 같은 경우에는 기존 행동 후보 순서를 유지한다.
    """
    memo = {}

    def solve(remaining, hnd, filled, unloading, depth_left):
        if _is_goal(remaining, hnd):
            return []
        if depth_left <= 0:
            return None

        key = (
            tuple(sorted(remaining)),
            hnd['R'],
            hnd['L'],
            tuple(sorted(filled)),
            unloading,
            depth_left,
        )
        if key in memo:
            cached = memo[key]
            return None if cached is None else list(cached)

        best_path = None
        best_priority = None

        for action in _generate_actions_safe(
            remaining, hnd, filled, unloading, preferred_slots, colors
        ):
            new_r, new_h, new_f, new_u = _apply_action_safe(
                action, remaining, hnd, filled, colors, unloading
            )
            suffix = solve(
                new_r, new_h, new_f, new_u, depth_left - 1
            )
            if suffix is None:
                continue

            candidate = [action] + suffix
            priority = _pickup_plan_priority(
                candidate,
                hnd,
                preferred_slots,
                include_first_pick_priority=(
                    len(remaining) == 4
                    and hnd['R'] is None
                    and hnd['L'] is None
                    and not filled
                ),
            )
            if best_priority is None or priority < best_priority:
                best_path = candidate
                best_priority = priority

        memo[key] = None if best_path is None else tuple(best_path)
        return None if best_path is None else list(best_path)

    hands0 = {'R': None, 'L': None}
    return solve({1, 2, 3, 4}, hands0, set(), False, max_depth)

def validate_pickup_plan(colors, action_list, preferred_slots=None):
    """실제 모터를 움직이기 전에 planner 결과가 안전한 최종 상태까지 도달하는지 재검증한다."""
    if action_list is None:
        return False

    remaining = {1, 2, 3, 4}
    hnd = {'R': None, 'L': None}
    filled = set()
    unloading = False

    try:
        for action in action_list:
            allowed = _generate_actions_safe(
                remaining, hnd, filled, unloading, preferred_slots, colors
            )
            if action not in allowed:
                return False
            remaining, hnd, filled, unloading = _apply_action_safe(
                action, remaining, hnd, filled, colors, unloading
            )
    except (KeyError, TypeError, IndexError):
        return False

    return _is_goal(remaining, hnd) and len(filled) == 4

def recovery_plan_score(action_list, known_slots):
    """
    복구 후보 우선순위:
    적은 수집 묶음 → 첫 수집의 정상 슬롯 수 → 정상끼리 동시 드롭 → 전체 동시 드롭 → 짧은 계획.
    """
    known_slots = set(known_slots)
    held_slots = {'R': None, 'L': None}
    pickup_batches = 0
    known_pair_drops = 0
    simultaneous_drops = 0
    known_in_batch = 0
    first_batch_known_count = None

    for action in action_list:
        if action[0] == 'pick':
            if held_slots['R'] is None and held_slots['L'] is None:
                pickup_batches += 1
                known_in_batch = 0
            held_slots[action[2]] = action[1]
            if action[1] in known_slots:
                known_in_batch += 1
        elif action[0] == 'pick_pair':
            if held_slots['R'] is None and held_slots['L'] is None:
                pickup_batches += 1
                known_in_batch = 0
            held_slots['R'] = action[2]
            held_slots['L'] = action[3]
            known_in_batch += (
                (1 if action[2] in known_slots else 0)
                + (1 if action[3] in known_slots else 0)
            )
        elif action[0] == 'drop':
            held_slots[action[1]] = None
        elif action[0] == 'drop_both':
            simultaneous_drops += 1
            if (held_slots['R'] in known_slots
                and held_slots['L'] in known_slots):
                known_pair_drops += 1
            held_slots['R'] = None
            held_slots['L'] = None

        if (held_slots['R'] is None and held_slots['L'] is None
            and first_batch_known_count is None):
            first_batch_known_count = known_in_batch

    return (
        -pickup_batches,
        first_batch_known_count or 0,
        known_pair_drops,
        simultaneous_drops,
        -len(action_list)
    )


def test_all_120_cases():
    """120개 정상 색상 배치가 실제 재배열된 픽업/드롭 안전 검사를 통과하는지 검증한다."""
    from itertools import permutations
    colors5 = [5, 3, 1, 2, 4]  # RED GREEN BLACK BLUE YELLOW

    success = 0
    fail = 0
    fail_cases = []

    for combo in permutations(colors5, 4):
        colors = {1: combo[0], 2: combo[1], 3: combo[2], 4: combo[3]}
        result = select_safe_pickup_execution(colors)
        if result is None:
            fail += 1
            fail_cases.append(colors)
        else:
            success += 1

    # 기존 일반 출력문 주석 처리
    # print("=== 전체 120가지 검증 결과 ===")
    pass
    # 기존 일반 출력문 주석 처리
    # print("성공:", success, " / 실패:", fail)
    pass
    for c in fail_cases[:10]:
        # 기존 일반 출력문 주석 처리
        # print("  실패 사례:", c)
        pass
    return success, fail


# ----------------------------------------------------------------
# 신규 run_pickup_workflow - planner가 만든 action 리스트를 그대로 실행
# ----------------------------------------------------------------
def split_pickup_plan(action_list):
    """기존 planner 결과를 순서를 보존한 픽업/드롭 묶음으로 분리한다."""
    batches = []
    picks = []
    drops = []

    for action in action_list:
        if action[0] in ('pick', 'pick_pair'):
            if drops:
                batches.append((tuple(picks), tuple(drops)))
                picks = []
                drops = []
            picks.append(action)
        elif action[0] in ('drop', 'drop_both'):
            if not picks:
                raise ValueError("픽업보다 먼저 드롭 동작이 나왔습니다: " + str(action))
            drops.append(action)
        else:
            raise ValueError("정의되지 않은 planner 동작: " + str(action))

    if picks or drops:
        batches.append((tuple(picks), tuple(drops)))

    if len(batches) != 2:
        raise ValueError(
            "전면 2단계 실행에는 정확히 두 픽업 묶음이 필요합니다: "
            + str(len(batches))
        )
    if not all(batch_picks and batch_drops for batch_picks, batch_drops in batches):
        raise ValueError("픽업 또는 드롭이 비어있는 묶음이 있습니다.")
    return tuple(batches)


def build_front_execution_plan(action_list, drop_reversed=None):
    """
    기존 planner 판단 순서를 유지하면서 실제 실행을
    1차 픽업 -> 2차 픽업 -> 2차 드롭 -> 1차 드롭으로 바꾼다.

    반환 항목: (적재 단계, 원래 planner action)
    두 단계 모두 로봇 전면 자세에서 실행한다.
    drop_reversed가 True이면 드롭 묶음 순서를 뒤집고,
    각 묶음 안에서는 픽업한 손 순서를 유지한다.
    """
    if drop_reversed is None:
        drop_reversed = DROP_BATCHES_REVERSED
    batches = split_pickup_plan(action_list)
    execution = []

    for index, (picks, drops) in enumerate(batches):
        side = PICKUP_FRONT if index == 0 else PICKUP_REAR
        for action in picks:
            execution.append((side, action))

    drop_indexes = range(len(batches))
    if drop_reversed:
        drop_indexes = range(len(batches) - 1, -1, -1)

    for index in drop_indexes:
        picks, drops = batches[index]
        side = PICKUP_FRONT if index == 0 else PICKUP_REAR

        ordered_drops = list(drops)
        if drop_reversed:
            hand_order = []
            for pick_action in picks:
                if pick_action[0] == 'pick_pair':
                    hand_order.extend(('R', 'L'))
                elif pick_action[0] == 'pick':
                    hand_order.append(pick_action[2])

            pending = list(drops)
            ordered_drops = []
            for hand in hand_order:
                for drop_action in list(pending):
                    if (drop_action[0] == 'drop'
                        and drop_action[1] == hand):
                        ordered_drops.append(drop_action)
                        pending.remove(drop_action)
                        break
            ordered_drops.extend(pending)

        for action in ordered_drops:
            execution.append((side, action))

    return tuple(execution)


SIM_ZONE_NAME = {
    (0, 1): 'Zone01', (1, 2): 'Zone12', (2, 3): 'Zone23',
    (3, 4): 'Zone34', (4, 5): 'Zone45', (5, 6): 'Zone56',
}


def build_simulation_trace(colors, action_list, drop_reversed=None):
    """
    실제 전면 2단계 실행 계획을 함수 단위의 순수 데이터로 변환한다.
    브라우저 시뮬레이터와 컴퓨터 전수검증이 이 결과를 함께 사용한다.
    """
    execution_plan = build_front_execution_plan(action_list, drop_reversed)
    sim_cargo = {
        PICKUP_FRONT: {'R': None, 'L': None},
        PICKUP_REAR: {'R': None, 'L': None},
    }
    sim_filled = set()
    last_pair = None
    last_pair_side = None
    last_zone = None
    last_zone_side = None
    at_museum = False
    trace = []

    for side, action in execution_plan:
        kind = action[0]

        if kind in ('pick', 'pick_pair'):
            pair_name = (
                SLOT_HAND_TO_PAIR[(action[1], action[2])]
                if kind == 'pick' else action[1]
            )
            if last_pair != pair_name:
                trace.append({
                    'type': 'pair',
                    'function': pair_name if last_pair is None else 'MoveBetweenPairs',
                    'side': side,
                    'pair': pair_name,
                    'from_pair': last_pair,
                    'from_side': last_pair_side,
                    'to_pair': pair_name,
                })

            if kind == 'pick':
                slot = action[1]
                hand = action[2]
                sim_cargo[side][hand] = (
                    slot, colors[slot], DROP_ZONE[colors[slot]]
                )
                trace.append({
                    'type': 'pick',
                    'function': 'grab_hand',
                    'side': side,
                    'pair': pair_name,
                    'slots': (slot,),
                    'hands': (hand,),
                    'physical_hands': (physical_hand_for_side(hand, side),),
                })
            else:
                r_slot = action[2]
                l_slot = action[3]
                sim_cargo[side]['R'] = (
                    r_slot, colors[r_slot], DROP_ZONE[colors[r_slot]]
                )
                sim_cargo[side]['L'] = (
                    l_slot, colors[l_slot], DROP_ZONE[colors[l_slot]]
                )
                trace.append({
                    'type': 'pick',
                    'function': 'grab_both',
                    'side': side,
                    'pair': pair_name,
                    'slots': (r_slot, l_slot),
                    'hands': ('R', 'L'),
                    'physical_hands': (
                        physical_hand_for_side('R', side),
                        physical_hand_for_side('L', side),
                    ),
                })

            last_pair = pair_name
            last_pair_side = side
            continue

        if not at_museum:
            trace.append({
                'type': 'museum',
                'function': 'GoToMuseumFrom' + last_pair,
                'side': last_pair_side,
                'from_pair': last_pair,
            })
            at_museum = True

        if kind == 'drop':
            hand = action[1]
            item = sim_cargo[side][hand]
            if item is None:
                raise ValueError("시뮬레이션 드롭 대상이 비었습니다: " + str((side, action)))
            zone = item[2]
            zone_pair = zone_pair_for_hand(hand, zone)
            physical_drop_hand = physical_hand_for_side(hand, side)
            drop_function = (
                'r_drop' if physical_drop_hand == 'R' else 'l_drop'
            )
            drop_slots = (item[0],)
            drop_hands = (hand,)
        else:
            left_item = sim_cargo[side]['L']
            right_item = sim_cargo[side]['R']
            if left_item is None or right_item is None:
                raise ValueError("시뮬레이션 동시 드롭 대상이 비었습니다: " + str((side, action)))
            zone_pair = (left_item[2], right_item[2])
            drop_function = 'both_drop'
            drop_slots = (right_item[0], left_item[0])
            drop_hands = ('R', 'L')

        if not is_zone_safe(zone_pair, sim_filled):
            raise ValueError("시뮬레이션 위험 Zone 진입: " + str(zone_pair))

        zone_function = (
            SIM_ZONE_NAME[zone_pair]
            if last_zone is None else 'MoveBetweenZones'
        )
        trace.append({
            'type': 'zone',
            'function': zone_function,
            'side': side,
            'from_side': last_zone_side,
            'from_zone': last_zone,
            'zone_pair': zone_pair,
        })
        trace.append({
            'type': 'drop',
            'function': drop_function,
            'side': side,
            'zone_pair': zone_pair,
            'slots': drop_slots,
            'hands': drop_hands,
            'physical_hands': tuple(
                physical_hand_for_side(hand, side)
                for hand in drop_hands
            ),
        })
        trace.append({
            'type': 'retreat',
            'function': 'retreat_from_zone_to_lane',
            'side': side,
            'zone_pair': zone_pair,
        })

        if kind == 'drop':
            sim_filled.add(item[2])
            sim_cargo[side][hand] = None
        else:
            sim_filled.add(left_item[2])
            sim_filled.add(right_item[2])
            sim_cargo[side]['R'] = None
            sim_cargo[side]['L'] = None

        last_zone = zone_pair
        last_zone_side = side

    trace.append({
        'type': 'complete',
        'function': 'run_pickup_workflow',
        'side': last_zone_side,
        'zone_pair': last_zone,
    })
    return tuple(trace)


def _iter_two_batch_plans(colors, preferred_slots=None):
    """현행 픽업/존 안전 규칙 안에서 양손 2개씩 두 묶음의 대체 계획을 열거한다."""
    def search(remaining, hnd, filled, unloading, path):
        if _is_goal(remaining, hnd):
            yield path
            return
        for action in _generate_actions_safe(
            remaining, hnd, filled, unloading, preferred_slots, colors
        ):
            # 각 단계는 두 유물을 채운 뒤 드롭한다. 한 유물만 실은 별도 왕복은 제외.
            if (action[0] == 'drop' and not unloading
                and (hnd['R'] is None or hnd['L'] is None)):
                continue
            new_r, new_h, new_f, new_u = _apply_action_safe(
                action, remaining, hnd, filled, colors, unloading
            )
            for result in search(new_r, new_h, new_f, new_u, path + [action]):
                yield result

    return search({1, 2, 3, 4}, {'R': None, 'L': None}, set(), False, [])


def select_safe_pickup_execution(colors, action_list=None, preferred_slots=None):
    """
    실제 실행 순서까지 안전한 계획을 선택한다. 전역 드롭 설정은 변경하지 않는다.

    1. 기존 계획이 기본 드롭 순서로 안전하면 그대로 유지한다.
    2. 아니면 동일한 드롭 순서로 실행 가능한 다른 픽업 계획을 찾는다.
    3. 그래도 없으면 기존 계획을 반대 드롭 순서로 검증한다.

    반환: actions, drop_reversed, execution, trace를 가진 dict. 실패 시 None.
    plan_pickup은 기존 논리 계획 API이며, 실제 주행/미리보기에는 이 함수를 사용한다.
    """
    if action_list is None:
        action_list = plan_pickup(colors, preferred_slots=preferred_slots)
    if not validate_pickup_plan(colors, action_list, preferred_slots):
        return None

    def checked(actions, reversed_order):
        try:
            execution = build_front_execution_plan(actions, reversed_order)
            trace = build_simulation_trace(colors, actions, reversed_order)
        except (ValueError, KeyError, TypeError, IndexError):
            return None
        return {
            'actions': list(actions),
            'drop_reversed': reversed_order,
            'execution': execution,
            'trace': trace,
        }

    preferred_order = DROP_BATCHES_REVERSED
    original = checked(action_list, preferred_order)
    if original is not None:
        return original

    best = None
    best_priority = None
    for candidate in _iter_two_batch_plans(colors, preferred_slots):
        result = checked(candidate, preferred_order)
        if result is None:
            continue
        # 복구 시 정상 인식 슬롯 우선 정책을 유지하고, 같은 우선순위에서는
        # Pair 방문과 드롭 정차가 적은 계획을 택한다.
        priority = _pickup_plan_priority(
            candidate, {'R': None, 'L': None}, preferred_slots,
            include_first_pick_priority=True,
        ) + (
            sum(1 for event in result['trace'] if event['type'] == 'pair'),
            sum(1 for event in result['trace'] if event['type'] == 'drop'),
        )
        if best_priority is None or priority < best_priority:
            best = result
            best_priority = priority
    if best is not None:
        return best

    # 1차 적재 유물을 먼저 배출하는 기존 부분 드롭 함수를 사용하는 경로.
    return checked(action_list, not preferred_order)


def prepare_pickup_colors(colors, verbose=True):
    """
    Scan 결과를 검사하고 planner에 전달할 안전한 4색 배치를 만든다.

    처리 원칙:
      1) 서로 다른 정상 색상(1~5)은 원래 슬롯과 드롭존을 그대로 보존한다.
      2) 0, 6, UNKNOWN_COLOR 및 두 번째 이후의 중복 색상은 UNKNOWN으로 본다.
      3) UNKNOWN은 정상 색상이 사용하지 않은 빈 존에 서로 겹치지 않게 임시 배정한다.
      4) 가능한 후보를 모두 planner로 검증하고, 수집 횟수와 정상 인식 우선순위를 비교한다.

    반환:
      (resolved_colors, known_slots, unknown_slots, action_list)
      복구 계획을 만들 수 없으면 None
    """
    normalized = {}
    known_slots = []
    unknown_slots = []
    seen_colors = set()
    issue_text = {}

    for slot in (1, 2, 3, 4):
        color = colors.get(slot, UNKNOWN_COLOR)
        if color in VALID_ARTIFACT_COLORS and color not in seen_colors:
            normalized[slot] = color
            known_slots.append(slot)
            seen_colors.add(color)
        else:
            normalized[slot] = UNKNOWN_COLOR
            unknown_slots.append(slot)
            if color in seen_colors:
                issue_text[slot] = Color_Name(color) + " 중복"
            else:
                issue_text[slot] = Color_Name(color) + "(" + str(color) + ")"

    # 네 슬롯이 모두 서로 다른 정상 색상이면 기존 planner 결과를 그대로 사용한다.
    if not unknown_slots:
        action_list = plan_pickup(normalized)
        if not validate_pickup_plan(normalized, action_list):
            if verbose:
                # 기존 일반 출력문 주석 처리
                # print("[오류] 정상 색상 배치의 planner 사전 검증 실패")
                pass
            return None
        if verbose:
            # 기존 일반 출력문 주석 처리
            # print("[SCAN 검사] 4개 슬롯 정상 - 기존 planner 경로 사용")
            pass
        return normalized, tuple(known_slots), tuple(), action_list

    available_colors = [
        color for color in VALID_ARTIFACT_COLORS if color not in seen_colors
    ]
    preferred_slots = set(known_slots)
    best = {'score': None, 'colors': None, 'actions': None}

    def search_assignment(index, candidate, remaining_colors):
        if index == len(unknown_slots):
            action_list = plan_pickup(
                candidate, preferred_slots=preferred_slots
            )
            if not validate_pickup_plan(
                candidate, action_list, preferred_slots
            ):
                return

            score = recovery_plan_score(action_list, preferred_slots)
            if best['score'] is None or score > best['score']:
                best['score'] = score
                best['colors'] = dict(candidate)
                best['actions'] = list(action_list)
            return

        slot = unknown_slots[index]
        for color in remaining_colors:
            candidate[slot] = color
            next_colors = [c for c in remaining_colors if c != color]
            search_assignment(index + 1, candidate, next_colors)
        candidate[slot] = UNKNOWN_COLOR

    search_assignment(0, dict(normalized), available_colors)

    if best['colors'] is None:
        if verbose:
            # 기존 일반 출력문 주석 처리
            # print("[오류] UNKNOWN 슬롯을 위한 안전한 복구 계획을 찾지 못했습니다.")
            pass
        return None

    resolved = best['colors']
    if verbose:
        # 기존 일반 출력문 주석 처리
        # print("[RECOVERY] 미확인 슬롯 복구 계획 생성")
        pass
        for slot in unknown_slots:
            assigned_color = resolved[slot]
            # 기존 일반 출력문 주석 처리
            # print(
            #     "  슬롯" + str(slot) + ": " + issue_text[slot]
            #     + " -> " + Color_Name(assigned_color)
            #     + " / 빈 존" + str(DROP_ZONE[assigned_color]) + " 임시 배정"
            # )
            pass
        # 기존 일반 출력문 주석 처리
        # print(
        #     "[RECOVERY] 수집 묶음=" + str(-best['score'][0])
        #     + " / 첫 수집 정상=" + str(best['score'][1])
        #     + " / 정상끼리 동시 드롭=" + str(best['score'][2])
        #     + " / 전체 동시 드롭=" + str(best['score'][3])
        #     + " / 전체 동작=" + str(len(best['actions']))
        # )
        pass

    return (
        resolved,
        tuple(known_slots),
        tuple(unknown_slots),
        best['actions']
    )

async def run_pickup_workflow(colors, preferred_slots=None, action_list=None):
    """
    스캔된 색상 배치를 planner(plan_pickup)에 넘겨 action 리스트를 받고,
    시뮬레이터와 같은 함수 단위 로그를 순서대로 출력하며 실행한다.

    매개변수:
        colors - {1: 슬롯1 색상ID, 2: 슬롯2 색상ID, 3: 슬롯3 색상ID, 4: 슬롯4 색상ID}
    """
    global _step_count
    _step_count = 0
    reset_pickup_state(colors)

    if action_list is None:
        action_list = plan_pickup(colors, preferred_slots=preferred_slots)
    if action_list is None:
        # 기존 일반 출력문 주석 처리
        # print("[오류] planner가 계획을 찾지 못했습니다 (이론상 발생하면 안 됨 - 버그 확인 필요)")
        pass
        return False

    if not validate_pickup_plan(colors, action_list, preferred_slots):
        # 기존 일반 출력문 주석 처리
        # print("[오류] planner 사전 안전 검증에 실패했습니다 - 로봇을 움직이지 않습니다.")
        pass
        return False

    # 기존 일반 출력문 주석 처리
    # print("=== [PLAN] 전체 계획 (총 " + str(len(action_list)) + "개 동작) ===")
    pass
    for i, a in enumerate(action_list, 1):
        # 기존 일반 출력문 주석 처리
        # print("[PLAN " + str(i) + "] " + str(a))
        pass

    selected = select_safe_pickup_execution(colors, action_list, preferred_slots)
    if selected is None:
        print("[오류] 안전한 픽업/드롭 실행 계획이 없습니다.")
        return False
    action_list = selected['actions']
    execution_plan = selected['execution']
    drop_reversed = selected['drop_reversed']
    print("[PLAN] 드롭 순서: " + ("2차 -> 1차" if drop_reversed else "1차 -> 2차"))

    # 기존 일반 출력문 주석 처리
    # print("\n=== [EXEC] 전면 2단계 실행 계획 ===")
    pass
    for i, tagged_action in enumerate(execution_plan, 1):
        # 기존 일반 출력문 주석 처리
        # print("[EXEC PLAN " + str(i) + "] " + str(tagged_action))
        pass

    # 기존 일반 출력문 주석 처리
    # print("\n=== [EXEC] 실행 시작 ===")
    pass
    for i, tagged_action in enumerate(execution_plan, 1):
        pickup_side, a = tagged_action
        # 기존 일반 출력문 주석 처리
        # print("[EXEC " + str(i) + "/" + str(len(execution_plan)) + "] "
        #       + pickup_side + " " + str(a))
        pass
        ok = False
        if a[0] == 'pick':
            _, slot, hd = a
            ok = await pick_slot(slot, hd, pickup_side)
        elif a[0] == 'pick_pair':
            _, pair_name, r_slot, l_slot = a
            ok = await pick_pair_action(
                pair_name, r_slot, l_slot, pickup_side
            )
        elif a[0] == 'drop':
            _, hd = a
            ok = await drop_hand(hd, pickup_side, drop_reversed)
        elif a[0] == 'drop_both':
            ok = await drop_both_if_direct(pickup_side, drop_reversed)

        if not ok:
            # 기존 일반 출력문 주석 처리
            # print("[오류] 동작 실패: " + str(a) + " - 이후 동작을 중단합니다.")
            pass
            return False

    mission_complete = (
        not remaining_slots
        and cargo_is_empty()
        and len(filled_zones) == 4
    )
    if not mission_complete:
        # 기존 일반 출력문 주석 처리
        # print("[오류] 최종 상태 검증 실패 - " + state_str())
        pass
        return False

    # # 마지막 드롭 후에는 기존 RecenterFromZoneXX()로 검정선을 찾아 중앙 기준을 복원한다.
    # if _at_museum and _last_zone is not None:
    #     await recenter_from_current_zone("run_pickup_workflow 최종 정렬")

    # 기존 일반 출력문 주석 처리
    # print("\n=== 완료 (총 " + str(_step_count) + " STEP 실행됨, filled_zones=" + str(filled_zones) + ") ===")
    pass
    _trace("run_pickup_workflow()")
    return True


# ----------------------------------------------------------------
# 케이스별 워크플로우 (예전 CASE1/2/3 고정 방식 - 이제 안 쓰이지만 참고용으로 남겨둠)
#    CASE1 : 기본 순서 - 1,2 동시 픽업 -> 3,4 동시 픽업 -> 한번에 드롭(방향 자동 판단)
#    CASE2 : 2,3 교차 픽업 -> 드롭(방향 자동 판단) -> 1,4 각각 픽업 -> 드롭(방향 자동 판단)
#    CASE3 : 짝이 전혀 안 맞음 - 1,4 각각 픽업 -> 드롭 -> 2,3 교차 픽업 -> 드롭
#            (순서는 지금 임의 지정 - 나중에 변경 가능)
#
#    드롭 방향(direct/cross)은 케이스와 무관하게, 매 드롭 시점마다
#    그 순간 양팔이 들고 있는 존 번호를 보고 deliver_smart()가 알아서 판단한다.
# ----------------------------------------------------------------
async def run_pickup_workflow_legacy(colors):
    """
    (예전 방식 - 더 이상 run_pickup_mission()에서 호출되지 않음, 참고용으로 보존)
    스캔된 색상 배치를 바탕으로 케이스를 판별하고, 그에 맞는 순서로
    Pair 방문(픽업) + deliver_smart(드롭)를 실행하는 전체 지휘자 함수.

    매개변수:
        colors - {1: 슬롯1 색상ID, 2: 슬롯2 색상ID, 3: 슬롯3 색상ID, 4: 슬롯4 색상ID}
    """
    global _step_count
    _step_count = 0   # 이번 실행의 STEP 번호를 1부터 다시 세기 시작

    z = {slot: DROP_ZONE[c] for slot, c in colors.items()}
    case = decide_case(colors)
    # 기존 일반 출력문 주석 처리
    # print("[선택된 케이스] " + case)
    pass

    if case == "CASE1":
        await Pair12()
        await deliver_smart([z[1]], [z[2]])
        await Pair34()
        await Pair45()
        await deliver_smart([z[3]], [z[4]])
    elif case == "CASE2":
        await Pair23()
        await deliver_smart([z[2]], [z[3]])
        # await Pair12()
        # await Pair34()
        # await deliver_smart([z[1]], [z[4]])
    else:  # CASE3
        await Pair12()
        await deliver_smart([z[1]], [z[2]])
        await Pair34()
        await deliver_smart([z[3]], [z[4]])

        # await Pair23()
        # await cross_pick()         # 슬롯2, 슬롯3
        # await arm_reset()
        # await deliver_smart([z[2]], [z[3]])

    # 기존 일반 출력문 주석 처리
    # print("\n=== 픽업+배달 완료 (총 " + str(_step_count) + " STEP 실행됨) ===")
    pass



# ----------------------------------------------------------------
# 메인 미션 (WRO_pickup_mission_02.py 의 run_task()가 호출하는 진입점)
# ----------------------------------------------------------------
async def run_pickup_mission():
    """
    유물 픽업 미션의 최상위 진입점. WRO_pickup_mission_02.py의 run_task()가 이 함수를 호출한다.
    스캔 -> 원위치 복귀 -> 색상 정리 -> run_pickup_workflow() 실행까지 전체 순서를 담당한다.
    매개변수 없음.
    """
    await wait(100)

    # 기존 일반 출력문 주석 처리
    # print("=== Phase 0: 스캔 ===")
    pass
    #await Scan(SCAN_SPEED, SCAN_DEG)
    # 기존 일반 출력문 주석 처리
    # print("slots:", slots)
    pass
    # 기존 일반 출력문 주석 처리
    # print("blockLocation:", blockLocation)
    pass

    # 스캔하며 이동한 만큼 원위치로 되돌아옴
    # await MoveStraight_blk_Control(-80)
    # await MoveStraight(50, 50)
    # await TurnGyro_Control(90,50)
    # await MoveStraight(180, -50)

    scanned_colors = {
        1: slots[0],
        2: slots[1],
        3: slots[2],
        4: slots[3],
    }

    # 현재 첨부 코드처럼 Scan() 호출이 주석 상태이고 수동 테스트 값도 없다면,
    # 기본 UNKNOWN 네 개를 실제 스캔 결과로 오해해 움직이지 않도록 막는다.
    if (not scanCompleted
        and all(color == UNKNOWN_COLOR for color in scanned_colors.values())):
        # 기존 일반 출력문 주석 처리
        # print("[오류] Scan()이 실행되지 않았고 수동 슬롯 값도 없습니다.")
        pass
        return False

    names = ""
    for slot_num in (1, 2, 3, 4):
        names += "슬롯" + str(slot_num) + "=" + Color_Name(scanned_colors[slot_num]) + " "
    print("[SCAN] " + names)

    prepared = prepare_pickup_colors(scanned_colors)
    if prepared is None:
        # 기존 일반 출력문 주석 처리
        # print("[오류] 복구 계획 생성 실패 - 픽업 동작을 시작하지 않습니다.")
        pass
        return False

    colors, known_slots, unknown_slots, action_list = prepared
    resolved_names = ""
    for slot_num in (1, 2, 3, 4):
        resolved_names += (
            "슬롯" + str(slot_num) + "=" + Color_Name(colors[slot_num])
            + "(존" + str(DROP_ZONE[colors[slot_num]]) + ") "
        )
    # 기존 일반 출력문 주석 처리
    # print("[실행 배치] " + resolved_names)
    pass
    if unknown_slots:
        # 기존 일반 출력문 주석 처리
        # print("[RECOVERY] 정상 인식 슬롯 우선: " + str(known_slots))
        pass

    # 기존 일반 출력문 주석 처리
    # print("=== Phase 1~2: 케이스 판별 + 픽업/드롭 실행 ===")
    pass
    success = await run_pickup_workflow(
        colors,
        preferred_slots=set(known_slots) if unknown_slots else None,
        action_list=action_list
    )

    if success:
        return True

    return False


