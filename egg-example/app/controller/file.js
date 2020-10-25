'use strict'
const Controller = require('egg').Controller
const fs = require('fs')
const path = require('path')
class FileController extends Controller {
	// 上传
	async upload() {
		const {
			ctx,
			app,
			service
		} = this
		const currentUser = ctx.authUser
		console.log(ctx.request.files)
		if (!ctx.request.files) {
			return ctx.apiFail('请先选择上传文件')
		}
		ctx.validate({
			file_id: {
				required: true,
				type: 'int',
				defValue: 0,
				desc: '目录id',
			},
		})
		const file_id = ctx.query.file_id
		console.log(file_id + '&&&&&&&&&')
		let f
		// 目录id是否存在
		if (file_id > 0) {
			// 目录是否存在,存在就返回目录对象，从而取得目录名字，不存在直接在service就出错返回了
			await service.file.isDirExist(file_id).then((res) => {
				console.log(res + '>>>>>>>>>>')
				f = res
			})
		}
		//取得上传的文件对象
		const file = ctx.request.files[0]
		//动态将目录名称作为前缀和文件名拼接
		const name = f.name + '/' + ctx.genID(10) + path.extname(file.filename)
		// 判断用户网盘内存是否不足
		let s = await new Promise((resolve, reject) => {
			fs.stat(file.filepath, (err, stats) => {
				resolve((stats.size / 1024).toFixed(1))
			})
		})
		if (currentUser.total_size - currentUser.used_size < s) {
			return ctx.apiFail('你的可用内存不足')
		}
		// 上传到oss
		let result
		try {
			result = await ctx.oss.put(name, file.filepath)
		} catch (err) {
			console.log(err)
		}
		//得到文件url
		console.log(result.url)
		// 写入到数据表
		if (result) {
			let addData = {
				name: file.filename,
				ext: file.mimeType,
				md: result.name,
				file_id,
				user_id: currentUser.id,
				size: parseInt(s),
				isdir: 0,
				url: result.url,
			}
			let res = await app.model.File.create(addData)
			// 更新用户的网盘内存使用情况
			currentUser.used_size = currentUser.used_size + parseInt(s)
			currentUser.save()
			return ctx.apiSuccess(res)
		}
		ctx.apiFail('上传失败')
	};
	// 剩余容量
	async getSize() {
		const {
			ctx,
			service
		} = this
		return ctx.apiSuccess({
			total_size: ctx.authUser.total_size,
			used_size: ctx.authUser.used_size,
		})
	};

	// 文件列表
	async list() {
		const {
			xtx,
			app
		} = this;
		const user_id = this.ctx.authUser.id;
		this.ctx.validate({
			file_id: {
				required: true,
				type: 'int',
				defValue: 0,
				desc: '目录id',
			},
			orderby: {
				required: false,
				type: 'string',
				defValue: 'name',
				range: { in: ['name', 'created_time'],
				},
				desc: '排序',
			},
			type: {
				required: false,
				type: 'string',
				desc: '类型',
			},
		});
		const {
			file_id,
			orderby,
			type
		} = this.ctx.query;
		let where = {
			user_id,
			file_id,
		};

		if (type && type !== 'all') {
			const Op = app.Sequelize.Op;
			where.ext = {
				[Op.like]: type + '%',
			};
		}

		let rows = await app.model.File.findAll({
			where,
			order: [
				['isdir', 'desc'],
				[orderby, 'desc'],
			],
		});

		this.ctx.apiSuccess({
			rows,
		});
	}
	// 创建文件夹
	async createdir() {
		const {
			ctx,
			app
		} = this;
		const user_id = ctx.authUser.id;

		ctx.validate({
			file_id: {
				required: true,
				type: 'int',
				defValue: 0,
				desc: '目录id',
			},
			name: {
				required: true,
				type: 'string',
				desc: '文件夹名称',
			},
		});

		let {
			file_id,
			name
		} = ctx.request.body;

		// 验证目录id是否存在
		if (file_id) {
			await this.service.file.isDirExist(file_id);
		}

		let res = await app.model.File.create({
			name,
			file_id,
			user_id,
			isdir: 1,
			size: 0,
		});

		ctx.apiSuccess(res);
	}

}

module.exports = FileController
