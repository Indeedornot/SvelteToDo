import cuid from 'cuid';

/**
 * Abstract entity model with `gid` property initialization
 * and `equals` method for entity comparisons.
 */
export abstract class AbstractEntity {
	constructor(public id = cuid(), public createdAt = new Date(), public updatedAt = new Date()) {}
}
