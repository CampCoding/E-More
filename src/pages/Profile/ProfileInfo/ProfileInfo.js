import styles from './ProfileInfo.module.css';

export default function ProfileInfo({userData}) {
  return (
    <div className={`${styles.ProfileInfoContainer}`}>
      <h2>Profile Information</h2>
      <div className={styles.info}>

         <div>
          <p className={styles.title}>Name</p>
          <h4>{userData.student_name}</h4>
         </div>

         <div>
          <p className={styles.title}>Email</p>
          <h4>{userData.student_email}</h4>
         </div>

         <div>
          <p className={styles.title}>Phone</p>
          <h4>{userData.phone}</h4>
         </div>
      </div>
    </div>
  )
}
