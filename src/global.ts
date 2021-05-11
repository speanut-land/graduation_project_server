export const sessionStorage = new Map();

export enum ResponseMsg {
	Empty = '',
	Create = '创建成功',
	Delete = '删除成功',
	Update = '更新成功',
	PasswordError = '密码错误',
	UserIsExist = '用户已存在',
	EmailIsExist = '邮箱已存在',
	EmailIsNotExist = '邮箱不存在',
	UserNameIsExist = '用户已存在',
	DatasetIsNotExist = '数据集不存在',
	UserIsNotExist = '用户不存在',
	LoginSuccess = '登陆成功',
}

export enum ResponseCode {
	Success,
	PasswordError,
	EmailIsExist,
	EmailIsNotExist,
	UserIsExist,
	UserNameIsExist,
	UserIsNotExist,
	DatasetIsNotExist,
	Error = 500,
}
