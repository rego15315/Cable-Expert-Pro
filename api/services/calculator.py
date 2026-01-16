import math
from typing import Dict, Any

class CableCalculatorService:
    CABLE_SIZES = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300]
    # 标准断路器额定电流库
    BREAKER_MODELS = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 250, 400, 630]
    
    # 载流量映射 (IEC 60364-5-52 简化版)
    BASE_CAPACITY = {
        1.5: 18, 2.5: 25, 4: 34, 6: 43, 10: 60, 16: 80, 
        25: 106, 35: 131, 50: 159, 70: 202, 95: 244, 
        120: 282, 150: 324, 185: 371, 240: 436, 300: 500
    }

    @staticmethod
    def calculate(data: Dict[str, Any]) -> Dict[str, Any]:
        p = float(data.get('power', 15)) * 1000
        v = float(data.get('voltage', 380))
        dist = float(data.get('distance', 50))
        scenario = data.get('scenario', 'general')
        mount_type = data.get('mount_type', 'concealed')
        material = data.get('material', 'CU')
        temp = float(data.get('temp', 30))
        
        # 1. 功率因数策略
        pf = 0.85
        if scenario == 'lighting': pf = 0.95
        elif scenario == 'homeAC': pf = 0.82
        
        # 2. 连续运行电流 Ib 计算与放大策略
        # 场景	启动电流	连续运行	线径策略
        # 照明: 小 / 否 / 按计算 (1.0)
        # 空调: 很大 / 是 / 放大 1 档
        # 普通动力: 大 / 是 / 放大 1.25~1.4 (1.3x)
        # 工业: 极大 / 是 / 放大 1~2 档
        
        ib_factor = 1.0
        if scenario == 'general': ib_factor = 1.3
        
        if v > 300: # 三相
            ib = (p / (math.sqrt(3) * v * pf)) * ib_factor
        else: # 单相
            ib = (p / (v * pf)) * ib_factor
            
        # 3. 修正系数 Kt (温度) 与 Km (暗装)
        kt = math.sqrt((70 - temp) / (70 - 30))
        km = 0.8 if mount_type == 'concealed' else 1.0 # 暗装载流量缩减 20%
        
        # 4. 基础线径选型
        target_capacity = ib / (kt * km)
        cable_size = 1.5
        idx = 0
        for size in CableCalculatorService.CABLE_SIZES:
            if CableCalculatorService.BASE_CAPACITY[size] >= target_capacity:
                cable_size = size
                idx = CableCalculatorService.CABLE_SIZES.index(size)
                break
        
        # 5. 场景强制升级策略
        if scenario == 'homeAC': 
            idx = min(idx + 1, len(CableCalculatorService.CABLE_SIZES) - 1)
        elif scenario == 'industrial': 
            idx = min(idx + 2, len(CableCalculatorService.CABLE_SIZES) - 1)
        
        final_size = CableCalculatorService.CABLE_SIZES[idx]
        
        # 6. 断路器选型 (In > Ib 且最接近)
        breaker = next((b for b in CableCalculatorService.BREAKER_MODELS if b >= ib * 1.25), 630)
        
        # 7. 压降检查 (IEC 要求 < 5%)
        rho = 0.0178 if material == 'CU' else 0.0285
        phase_factor = math.sqrt(3) if v > 300 else 2
        drop_v = phase_factor * ib * (rho * dist / final_size)
        drop_pct = (drop_v / v) * 100
        
        # 如果压降超标，继续升级线径
        while drop_pct > 5.0 and idx < len(CableCalculatorService.CABLE_SIZES) - 1:
            idx += 1
            final_size = CableCalculatorService.CABLE_SIZES[idx]
            drop_v = phase_factor * ib * (rho * dist / final_size)
            drop_pct = (drop_v / v) * 100

        return {
            "load_current_a": round(ib, 2),
            "recommended_cable_mm2": final_size,
            "recommended_breaker_a": breaker,
            "voltage_drop_pct": round(drop_pct, 2),
            "scenario": scenario
        }
