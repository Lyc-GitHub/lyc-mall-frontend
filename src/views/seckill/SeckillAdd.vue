<template>
  <div class="page-container">
    <div class="page-header">
      <h2>添加秒杀商品</h2>
      <el-button @click="goBack">返回列表</el-button>
    </div>
    <el-form ref="form" :model="form" label-width="120px" class="form-container" :rules="rules">
      <el-form-item label="商品名称" prop="productName">
        <el-input v-model="form.productName" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="商品概述" prop="summary">
        <el-input v-model="form.summary" placeholder="请输入商品概述"></el-input>
      </el-form-item>
      <el-form-item label="详细描述" prop="description">
        <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入详细描述"></el-input>
      </el-form-item>
      <el-form-item label="原价" prop="originalPrice">
        <el-input v-model.number="form.originalPrice" placeholder="请输入原价" type="number" prefix-icon="el-icon-money"></el-input>
      </el-form-item>
      <el-form-item label="秒杀价" prop="seckillPrice">
        <el-input v-model.number="form.seckillPrice" placeholder="请输入秒杀价" type="number" prefix-icon="el-icon-ticket"></el-input>
      </el-form-item>
      <el-form-item label="库存" prop="initStock">
        <el-input v-model.number="form.initStock" placeholder="请输入库存" type="number" prefix-icon="el-icon-box"></el-input>
      </el-form-item>
      <el-form-item label="秒杀开始时间" prop="startTime">
        <el-date-picker v-model="form.startTime" type="datetime" placeholder="选择开始时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="秒杀结束时间" prop="endTime">
        <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择结束时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="商品图片">
        <el-upload
          class="image-uploader"
          action="#"
          :http-request="customUploadRequest"
          :before-upload="beforeUpload"
          :file-list="imageList"
          :on-success="handleUploadSuccess"
          :on-remove="handleRemove"
          :on-preview="handleImagePreview"
          list-type="picture-card"
          multiple
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    
    <el-dialog title="请求参数预览" :visible.sync="showPreview" width="600px">
      <pre class="json-preview">{{ JSON.stringify(requestData, null, 2) }}</pre>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showPreview = false">关闭</el-button>
        <el-button type="primary" @click="confirmSubmit">确认提交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="图片预览" :visible.sync="showImagePreview" width="800px">
      <img :src="previewImageUrl" class="preview-image" />
    </el-dialog>
  </div>
</template>

<script>
import productApi from '@/api/product'
import OSS from 'ali-oss'

export default {
  name: 'SeckillAdd',
  data() {
    return {
      ossSts: null,
      form: {
        productName: '',
        summary: '',
        description: '',
        originalPrice: '',
        seckillPrice: '',
        initStock: '',
        startTime: '',
        endTime: ''
      },
      imageList: [],
      showPreview: false,
      showImagePreview: false,
      previewImageUrl: '',
      rules: {
        productName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        summary: [
          { required: true, message: '请输入商品概述', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入详细描述', trigger: 'blur' }
        ],
        originalPrice: [
          { required: true, message: '请输入原价', trigger: 'blur' },
          { type: 'number', min: 0.01, message: '原价必须大于0', trigger: 'blur' }
        ],
        seckillPrice: [
          { required: true, message: '请输入秒杀价', trigger: 'blur' },
          { type: 'number', min: 0.01, message: '秒杀价必须大于0', trigger: 'blur' }
        ],
        initStock: [
          { required: true, message: '请输入库存', trigger: 'blur' },
          { type: 'integer', min: 1, message: '库存必须大于0', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择秒杀开始时间', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择秒杀结束时间', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    requestData() {
      return {
        productName: this.form.productName,
        summary: this.form.summary,
        description: this.form.description,
        originalPrice: this.form.originalPrice,
        seckillPrice: this.form.seckillPrice,
        initStock: this.form.initStock,
        startTime: this.form.startTime ? this.formatDateTime(this.form.startTime) : '',
        endTime: this.form.endTime ? this.formatDateTime(this.form.endTime) : '',
        images: this.imageList.map(item => {
          if (item.saveUrl) {
            return item.saveUrl
          } else if (item.response && item.response.saveUrl) {
            return item.response.saveUrl
          }
          return ''
        }).filter(Boolean)
      }
    }
  },
  methods: {
    beforeUpload(file) {
      const isImage = file.type.startsWith('image/')
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isImage) {
        this.$message.error('只能上传图片文件')
        return false
      }
      if (!isLt10M) {
        this.$message.error('图片大小不能超过 10MB')
        return false
      }
      return true
    },

    async getStsToken() {
      const now = new Date().getTime()
      
      if (this.ossSts && this.ossSts.expiration) {
        const expirationTime = new Date(this.ossSts.expiration).getTime()
        if (expirationTime > now) {
          return this.ossSts
        }
      }

      const response = await productApi.getAddProductPolicy()
      this.ossSts = response.data
      return this.ossSts
    },

    async customUploadRequest(option) {
      const { file, onSuccess, onError } = option
      try {
        const sts = await this.getStsToken()

        const client = new OSS({
          region: sts.endpoint.replace('.aliyuncs.com', ''),
          accessKeyId: sts.accessKeyId,
          accessKeySecret: sts.accessKeySecret,
          stsToken: sts.securityToken,
          bucket: sts.bucket,
        })

        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 8)}${file.name.substring(file.name.lastIndexOf('.'))}`
        const objectKey = sts.dir + fileName
        
        const saveUrl = `https://${sts.bucket}.${sts.endpoint}/${objectKey}`

        await client.put(objectKey, file, {
          headers: {
            'Content-Type': file.type,
          },
        })

        const signedUrl = client.signatureUrl(objectKey, {
          expires: 1800,
          method: 'GET'
        })

        onSuccess({ url: signedUrl, saveUrl: saveUrl })
        this.$message.success('上传成功')
      } catch (err) {
        console.error(err)
        onError(err)
        this.$message.error('上传失败')
      }
    },

    handleUploadSuccess(response, file, fileList) {
      if (response) {
        file.url = response.url
        file.saveUrl = response.saveUrl
        this.imageList = fileList
      }
    },

    handleRemove(file, fileList) {
      this.imageList = fileList
    },

    handleImagePreview(file) {
      this.previewImageUrl = file.url || (file.response && file.response.url)
      this.showImagePreview = true
    },

    goBack() {
      this.$router.push('/seckill')
    },

    formatDateTime(date) {
      if (date instanceof Date) {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
      }
      return date
    },

    submitForm() {
      console.log(this.imageList)
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.seckillPrice >= this.form.originalPrice) {
            this.$message.error('秒杀价必须小于原价')
            return
          }
          if (this.form.endTime <= this.form.startTime) {
            this.$message.error('结束时间必须大于开始时间')
            return
          }
          this.showPreview = true
        } else {
          this.$message.error('请填写完整信息')
        }
      })
    },

    confirmSubmit() {
      this.$loading({ text: '提交中...' })
      productApi.addSeckillProduct(this.requestData)
        .then(res => {
          this.$loading().close()
          if (res.code === 200) {
            this.$message.success('添加成功')
            this.showPreview = false
            this.$router.push('/seckill')
          } else {
            this.$message.error(res.msg || '添加失败')
          }
        })
        .catch(error => {
          this.$loading().close()
          this.$message.error(error.message || '添加失败')
          this.showPreview = false
        })
    },

    resetForm() {
      this.$refs.form.resetFields()
      this.imageList = []
    }
  }
}
</script>

<style scoped>
.page-container {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 18px;
}

.form-container {
  max-width: 600px;
}

.image-uploader {
  margin-bottom: 10px;
}

.image-uploader .el-upload--picture-card {
  width: 120px;
  height: 120px;
  line-height: 120px;
}

.image-uploader .el-upload-list--picture-card .el-upload-list__item {
  width: 120px;
  height: 120px;
}

.image-uploader .el-upload-list--picture-card .el-upload-list__item-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.json-preview {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  max-height: 400px;
  overflow-y: auto;
  font-size: 13px;
  color: #333;
}

.dialog-footer {
  text-align: right;
}

.preview-image {
  width: 100%;
  height: auto;
}
</style>
