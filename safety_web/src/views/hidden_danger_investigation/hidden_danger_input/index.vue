<template>
  <div>
    <div class="page-title">{{form.dangerSource}}-隐患基本信息</div>
 <div class="page-content" v-loading='adding' style="height:660px">
      <el-row>
        <el-form ref="form" :model="form" :rules="dangerRule" label-width="150px" label-suffix="：">
          <el-row>
            <el-col :xl="8" :lg="10" :sm="12">
              <el-form-item label="施工队伍" prop="companyId" >
                <el-cascader
                  ref="companyChoose"
                  v-model="form.companyId"
                  :options="companys"
                  :props="{value: 'nodeCode',expandTrigger: 'hover'}"
                  @change="changeCompany"
                  :show-all-levels="false"
                  
                />
              </el-form-item>
              <el-form-item label="位置区域" prop="location">
                <el-input v-model="form.location"  placeholder="请填写" />
              </el-form-item>
              <el-form-item label="所属专业" prop='profession'>
                <el-input v-model="form.profession" placeholder="请填写" />
              </el-form-item>
              <el-form-item label="隐患类别" prop='types'>
               <el-cascader
                v-model="form.types"
                :options="checkTypes"
                :props="{ expandTrigger: 'hover',value: 'factorCode',children: 'childNode',label:'name'}"
                :disable-branch-nodes='true'
                ref="dangerType"
                :show-all-levels="false"
                @change="handleChange"></el-cascader>
              </el-form-item>
              <el-form-item label="原因分析">
                <el-select
                :disabled='select3'
                  v-model="form.factorSource"
                  placeholder="请选择隐患类别"
                  filterable
                  loading-text="查询中..."
                >
                  <el-option
                    v-for="item in factorSources"
                    :key="item.id"
                    :label="item.factorSourceName"
                    :value="item.factorSourceName"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="限期整改时间" prop='limitDate'>
                <el-date-picker
                  v-model="form.limitDate"
                  type="date"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <el-form-item label="隐患级别" prop='rank'>
                <el-select
                  v-model="form.rank"
                  placeholder="请选择"
                  filterable
                  loading-text="查询中..."
                >
                  <el-option
                    v-for="item in ranks"
                    :key="item.dictCode"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="隐患描述" prop='description'>
                <el-input type="textarea" v-model="form.description" :rows="5" placeholder="请填写" />
              </el-form-item>
              <el-form-item label="整改负责人" prop='person'>
                <el-select
                  v-model="form.person"
                  placeholder="请选择"
                  filterable
                  loading-text="查询中..."
                >
                  <el-option
                    v-for="item in employees"
                    :key="item.employeeID"
                    :label="`${item.name}(${item.companyName})`"
                    :value="`${item.employeeID} ${item.name}`"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="隐患文件上传">
               <el-upload
                  action="/api/uploadScreenShot"
                  :on-success="handleAvatarSuccess"
                  :headers="header"
                  :limit="2"            
                  :on-exceed="handleExceed"
                  accept=".jpg, .png, .bmp"
                >
                <el-button type="primary" icon="el-icon-upload">浏览文件</el-button>
                <span> 最多两张，格式为jpg,png,bmp</span>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :xl="8" :lg="10" :sm="12">
              <el-form-item label="作业项目" prop='workItem'>
                <el-input v-model="form.workItem" placeholder="请填写" />
              </el-form-item>
              <el-form-item label="检查时间" prop='supervisionDate'>
                <el-date-picker
                  v-model="form.supervisionDate"
                  type="date"
                  placeholder="选择检查时间"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="可能后果" prop='consequenceID'>
                <el-select
                  v-model="form.consequenceID"
                  placeholder="请选择"
                  filterable
                  loading-text="查询中..."
                >
                  <el-option
                    v-for="item in consequences"
                    :key="item.dictCode"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="产生的后果" prop='consequence'>
                <el-input v-model="form.consequence" placeholder="请填写" />
              </el-form-item>
              <el-form-item label="对应体系要素">
                <el-select
                  :disabled='select1'
                  v-model="form.factorHSE"
                  placeholder="请选择隐患类别"
                  filterable
                  loading-text="查询中..."
                >
                  <el-option
                    v-for="item in factorHSEs"
                    :key="item.factorHseId"
                    :label="item.factorHseName"
                    :value="item.factorHseName"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="归属职能部门">
                <el-select
                :disabled='select1'
                  v-model="form.factorDepartment"
                  placeholder="请选择隐患类别"
                  filterable
                  loading-text="查询中..."
                >
                  <el-option
                    v-for="item in factorDepartments"
                    :key="item.factorDepartmentCode"
                    :label="item.factorDepartmentName"
                    :value="item.factorDepartmentName"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="是否立即验收" style="margin-top:114px">
                   <el-radio v-model="ok" label="1">是</el-radio> 
                   <el-radio v-model="ok" label="0">否</el-radio>    
              </el-form-item>
               <br />
          <el-form-item label="操作" >
            <el-button type="primary" style="width:100px" @click="onSubmit" icon="el-icon-check">确认</el-button>
            <el-button type="danger" style="width:100px" @click="backAdd" icon="el-icon-refresh-right">返回</el-button>
          </el-form-item>
            </el-col>
          </el-row> 
        </el-form>
      </el-row>
    </div>
  </div>
</template>

<script>
import { GetCurrentUser } from '@/store/CurrentUser'
import {
  addDangerRecord,
  QueryFactorReason,
  QueryCompany,
  QueryFactor,
  QueryFactorDepartment,
  QueryFactorHSECode
} from '@/services/hidden_danger_investigation/dangerRecord'
import { GetEmployees } from '../../../services/employee'
import { GetDictionary } from '../../../services/dictionary'

export default {
  data() {
    return {
      form: {
        checkID: null,
        workItem: '', //作业项目
        SafeStaff_ID: '', // 检查人员
        companyId: '', //施工队伍id
        supervisionDate: '',//检查时间
        description: '',//隐患描述
        reformPerson: null,//整改负责人
        reformPersonID: null,//整改负责人ID
        limitDate: '',//限制时间
        ok: '1', //提交状态
        status: 1,
        consequenceID: '',//可能后果
        recordDate: '',
        rank: '',
        factorSource: null,
        profession:'', // 所属专业
        factorHSE: null,      
        factorDepartment: null,
        consequence:'',//产生的后果
        location: '',
        /* qHSE_FileAudit_ID: '', 
        QHSE_FileAuditRecord_ID: '',
        code: '', 
        QHSE_CheckCategory: '' //后续判断之后填入
        */
        dangerSource: '',
        affix1:  null,
        affix2:  null,
        types:'',
        person:''
      },
      ok:'1',
      person: '',
      header: { Authorization: GetCurrentUser().token },
      companys: [], // 公司
      employees: [], // 员工
      checkTypes: [], // 隐患类别
      type: '',
      consequences: [], //可能后果
      factorSources: [], //原因分析
      factorHSEs: [], //对应体系要素
      factorDepartments: [], //归属职能部门
      ranks: [], //隐患级别
      // 控制禁用选项
      select1:true,
      select2:true,
      select3:true,
      adding:false,
      fileNum:0,
      dangerRule:{
					companyId:[{
						required: 'true',
						message: '请选择公司',
						trigger: 'change'
					}],
          location:[{
						required: 'true',
						message: '请选择位置区域',
						trigger: 'change'
					}],
          types:[{
						required: 'true',
						message: '请选择隐患类别',
						trigger: 'change'
					}],
          profession:[{
						required: 'true',
						message: '请选择所属专业',
						trigger: 'change'
					}],
          limitDate:[{
						required: 'true',
						message: '请选择限期整改时间',
						trigger: 'change'
					}],
          rank:[{
						required: 'true',
						message: '请选择隐患级别',
						trigger: 'change'
					}],
          description:[{
						required: 'true',
						message: '请输入隐患描述',
						trigger: 'change'
					}],
          person:[{
						required: 'true',
						message: '请选择整改负责人',
						trigger: 'change'
					}],
          workItem:[{
						required: 'true',
						message: '请选择作业项目',
						trigger: 'change'
					}],
          supervisionDate:[{
						required: 'true',
						message: '请选择检查时间',
						trigger: 'change'
					}],
          consequenceID:[{
						required: 'true',
						message: '请填写可能后果',
						trigger: 'change'
					}],
          consequence:[{
						required: 'true',
						message: '请填写产生的后果',
						trigger: 'change'
					}],
				},
    }
  },
  created() {
    this.getSource()
    this.getCompany()
    this.getEmployees()
    this.getCheckTypes()
    this.getConsequences()
    this.getRanks()
    this.getrecordDate()
    // 设置检查类型
    !this.$route.params.type || localStorage.setItem('checkType',this.$route.params.type)
  },
  methods: {
    // 给附件命名
    handleAvatarSuccess(res) {
      this.fileNum++
      let key = 'affix' + this.fileNum
      this.form[key] = res.data
    },
    // 限制文件数量
    handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 2 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
    // 获取级联菜单
    handleChange(value){
      let typeNode = value[value.length - 1]
      let _this = this
      // 进度随便跑把 谁先到无所谓
      // 查询归属职能部门
      _this.factorDepartments = []
       _this.factorSources = []
        _this.factorHSEs = []
      QueryFactorDepartment(typeNode).then(res => {
        _this.factorDepartments = res.data
        _this.form.factorDepartment = res.data[0].factorDepartmentName
        _this.select2 = false
        _this.form.type = _this.$refs['dangerType'].inputValue
      }).catch(() => {
          this.$message.error('获取数据失败！')
        })
      
      // 查询原因
      QueryFactorReason(typeNode).then(res => {
        this.factorSources = res.data
        _this.form.factorSource = res.data[0].factorSourceName
        _this.select3 = false
      }).catch(() => {
          this.$message.error('获取数据失败！')
        })
      
      // 查询对应体系要素
      QueryFactorHSECode(typeNode)
        .then(res => {
          console.log(res)
           this.factorHSEs = res.data
           _this.form.factorHSE = res.data[0].factorHseName
           _this.select1 = false
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    getSource() {
      let source, _this = this
      _this.form.dangerSource = localStorage.getItem('dangerSource')
      this.form.SafeStaff_ID = GetCurrentUser().employeeId
      source = _this.form.dangerSource
      if (source === '体系运行'){
      const initData = JSON.parse(localStorage.getItem('sourcedata'))
      console.log(initData)
      _this.form.qHSE_FileAudit_ID = initData.qHSE_FileAudit_ID
      _this.form.qHSE_FileAuditRecord_ID = initData.qHSE_FileAuditRecord_ID
      _this.form.code = initData.code
      } else if (source === '隐患排查') {
      _this.form.qHSE_CheckCategory = _this.$route.params.type || localStorage.getItem('checkType')
      }
    },
    // 获取数据方法
    getCompany() {
      QueryCompany()
        .then(res => {
          this.companys = res.data
        })
        .catch(() => {
          this.$message.error('获取公司数据失败！')
        })
    },
    getEmployees() {
      GetEmployees({ name: '', type: 'all' })
        .then(res => {
          this.employees = res.data
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    getCheckTypes() {
      QueryFactor('隐患')
        .then(res => {
          this.checkTypes = res.data
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    getConsequences() {
      GetDictionary({ name: '后果' })
        .then(res => {
          console.log(res.data)
          this.consequences = res.data
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    getRanks() {
      GetDictionary({ name: '隐患级别' })
        .then(res => {
          this.ranks = res.data
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    backAdd(){
      this.$router.go(-1)
    },
    getrecordDate(){
      let nowDate = new Date()
      let month  = Number(nowDate.getMonth() + 1)
      let date = Number(nowDate.getDate())
      if(month >= 10) {
        month = String(month)
      } else {
        month = String('0' + month)
      }
      if(date >= 10) {
        date = String(date)
      } else {
        date = String('0' + date)
      }
      this.form.recordDate = `${nowDate.getFullYear()}-${month}-${date}`
    },
    formatForm() {    
      let arrs = this.form.person.split(' ')    
      this.form.reformPerson = arrs[1]
      this.form.reformPersonID = arrs[0]
      this.form.ok = Number(this.form.ok)
    },
    // 限制路由进入
    limitRouter(){
       // 在取消或者确定添加的时候删除暂存的item
       // 利用这个来判断路由是刷新还是直接输入路由的地址进入
       localStorage.removeItem('dangerSource')
       localStorage.removeItem('checkType')
       localStorage.removeItem('sourcedata')
    },
    // 确认提交方法
    onSubmit() {
      
      let _this = this
      this.$refs.form.validate((valid) => {
				if(valid){
          _this.adding = true
          _this.formatForm()
      addDangerRecord(_this.form)
        .then(res => {
          _this.$refs.form.resetFields();
          _this.adding = false
          _this.$message.success(res.message)
          _this.$router.go(-1)
        })
        .catch(err => {
          _this.adding = false
          _this.$message.error(err.message)
        })
        } else{
          _this.$message.warning('请把表单填写完整！')
        }
				})
    },

    // 一些事件
    changeCompany(value) {
      this.form.companyId = value[value.length - 1]
    },
     
  },
  beforeRouteEnter (to, from, next) {
     let fronRouter = from.name
    if((fronRouter === "QHSETroubleCheckTable" ) ){
      localStorage.setItem('dangerSource','隐患排查');
       next()
    }  
    if(localStorage.getItem('dangerSource','隐患排查')){
       next()
    }
    if (fronRouter === "FileCheckIndex" ) {
      localStorage.setItem('dangerSource','体系运行');
      next()
    } 
    if(localStorage.getItem('dangerSource','体系运行')) {
      next()
    }
  }
}
</script>

<style scoped>
.el-form-item {
  margin-bottom: 15px;
}
.el-select,
.el-cascader,
.el-input {
  width: 100%;
}
</style>
